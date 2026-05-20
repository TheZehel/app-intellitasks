package br.edu.intellitasks.http;

import static br.edu.intellitasks.http.HttpUtils.handleOptions;
import static br.edu.intellitasks.http.HttpUtils.message;
import static br.edu.intellitasks.http.HttpUtils.sendJson;

import br.edu.intellitasks.controller.AuthController;
import br.edu.intellitasks.controller.CategoryController;
import br.edu.intellitasks.controller.ProfileController;
import br.edu.intellitasks.controller.TaskController;
import br.edu.intellitasks.controller.UserController;
import br.edu.intellitasks.repository.CategoryRepository;
import br.edu.intellitasks.repository.TaskRepository;
import br.edu.intellitasks.repository.UserRepository;
import br.edu.intellitasks.service.AuthService;
import br.edu.intellitasks.service.ConflictException;
import br.edu.intellitasks.service.ForbiddenException;
import br.edu.intellitasks.service.NotFoundException;
import br.edu.intellitasks.service.PasswordService;
import br.edu.intellitasks.service.TaskService;
import br.edu.intellitasks.service.UnauthorizedException;
import br.edu.intellitasks.service.UserService;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class ApiServer {
  private final int port;
  private final CategoryController categoryController;
  private final TaskController taskController;
  private final AuthController authController;
  private final ProfileController profileController;
  private final UserController userController;

  public ApiServer(int port) {
    this.port = port;
    CategoryRepository categoryRepository = new CategoryRepository();
    TaskRepository taskRepository = new TaskRepository();
    UserRepository userRepository = new UserRepository();
    PasswordService passwordService = new PasswordService();
    AuthService authService = new AuthService(userRepository, passwordService);

    this.categoryController = new CategoryController(categoryRepository);
    this.taskController = new TaskController(new TaskService(taskRepository, categoryRepository));
    this.authController = new AuthController(authService);
    this.profileController = new ProfileController(authService);
    this.userController = new UserController(authService, new UserService(userRepository));
  }

  public void start() throws IOException {
    HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
    server.createContext("/api", this::dispatch);
    server.setExecutor(Executors.newFixedThreadPool(8));
    server.start();
    System.out.println("IntelliTasks Java MVC backend running on http://localhost:" + port);
  }

  private void dispatch(HttpExchange exchange) throws IOException {
    try {
      if (handleOptions(exchange)) {
        return;
      }

      String method = exchange.getRequestMethod();
      String path = exchange.getRequestURI().getPath();

      if (method.equals("GET") && path.equals("/api/categories")) {
        categoryController.list(exchange);
      } else if (method.equals("GET") && path.equals("/api/tasks")) {
        taskController.list(exchange);
      } else if (method.equals("POST") && path.equals("/api/tasks")) {
        taskController.create(exchange);
      } else if (path.matches("/api/tasks/[^/]+/toggle") && method.equals("PATCH")) {
        taskController.toggle(exchange, pathSegment(path, 2));
      } else if (path.matches("/api/tasks/[^/]+") && method.equals("PUT")) {
        taskController.update(exchange, pathSegment(path, 2));
      } else if (path.matches("/api/tasks/[^/]+") && method.equals("DELETE")) {
        taskController.delete(exchange, pathSegment(path, 2));
      } else if (method.equals("POST") && path.equals("/api/auth/register")) {
        authController.register(exchange);
      } else if (method.equals("POST") && path.equals("/api/auth/login")) {
        authController.login(exchange);
      } else if (method.equals("GET") && path.equals("/api/auth/me")) {
        authController.me(exchange);
      } else if (method.equals("POST") && path.equals("/api/auth/logout")) {
        authController.logout(exchange);
      } else if (method.equals("POST") && path.equals("/api/auth/logout-all")) {
        authController.logoutAll(exchange);
      } else if (method.equals("PATCH") && path.equals("/api/profile")) {
        profileController.update(exchange);
      } else if (method.equals("POST") && path.equals("/api/profile/password")) {
        profileController.updatePassword(exchange);
      } else if (method.equals("GET") && path.equals("/api/users")) {
        userController.list(exchange);
      } else if (path.matches("/api/users/[^/]+") && method.equals("PATCH")) {
        userController.update(exchange, pathSegment(path, 2));
      } else {
        sendJson(exchange, 404, message("Rota nao encontrada."));
      }
    } catch (UnauthorizedException error) {
      sendJson(exchange, 401, message(error.getMessage()));
    } catch (ForbiddenException error) {
      sendJson(exchange, 403, message(error.getMessage()));
    } catch (NotFoundException error) {
      sendJson(exchange, 404, message(error.getMessage()));
    } catch (ConflictException error) {
      sendJson(exchange, 409, message(error.getMessage()));
    } catch (IllegalArgumentException error) {
      sendJson(exchange, 400, message(error.getMessage()));
    } catch (Exception error) {
      error.printStackTrace();
      sendJson(exchange, 500, message("Erro interno do servidor."));
    }
  }

  private String pathSegment(String path, int index) {
    String[] parts = path.split("/");
    return parts[index + 1];
  }
}

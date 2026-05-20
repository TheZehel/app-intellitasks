package br.edu.intellitasks.controller;

import static br.edu.intellitasks.http.HttpUtils.getSessionToken;
import static br.edu.intellitasks.http.HttpUtils.readBody;
import static br.edu.intellitasks.http.HttpUtils.sendJson;

import br.edu.intellitasks.dto.UserManagementInput;
import br.edu.intellitasks.http.DtoMapper;
import br.edu.intellitasks.http.Json;
import br.edu.intellitasks.model.User;
import br.edu.intellitasks.service.AuthService;
import br.edu.intellitasks.service.UserService;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.Map;

public class UserController {
  private final AuthService authService;
  private final UserService userService;

  public UserController(AuthService authService, UserService userService) {
    this.authService = authService;
    this.userService = userService;
  }

  public void list(HttpExchange exchange) throws IOException {
    User currentUser = authService.requireUser(getSessionToken(exchange));
    sendJson(exchange, 200, Map.of("users", userService.list(currentUser).stream().map(DtoMapper::managedUser).toList()));
  }

  public void update(HttpExchange exchange, String id) throws IOException {
    User currentUser = authService.requireUser(getSessionToken(exchange));
    User updated = userService.update(currentUser, id, UserManagementInput.from(Json.parseObject(readBody(exchange))));
    sendJson(exchange, 200, Map.of("user", DtoMapper.managedUser(updated)));
  }
}

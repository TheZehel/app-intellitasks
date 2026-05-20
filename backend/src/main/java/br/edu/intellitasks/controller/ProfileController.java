package br.edu.intellitasks.controller;

import static br.edu.intellitasks.http.HttpUtils.getSessionToken;
import static br.edu.intellitasks.http.HttpUtils.readBody;
import static br.edu.intellitasks.http.HttpUtils.sendJson;

import br.edu.intellitasks.dto.PasswordInput;
import br.edu.intellitasks.dto.ProfileInput;
import br.edu.intellitasks.http.DtoMapper;
import br.edu.intellitasks.http.Json;
import br.edu.intellitasks.model.User;
import br.edu.intellitasks.service.AuthService;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.Map;

public class ProfileController {
  private final AuthService authService;

  public ProfileController(AuthService authService) {
    this.authService = authService;
  }

  public void update(HttpExchange exchange) throws IOException {
    User user = authService.requireUser(getSessionToken(exchange));
    User updated = authService.updateProfile(user, ProfileInput.from(Json.parseObject(readBody(exchange))));
    sendJson(exchange, 200, Map.of("user", DtoMapper.authUser(updated)));
  }

  public void updatePassword(HttpExchange exchange) throws IOException {
    String token = getSessionToken(exchange);
    User user = authService.requireUser(token);
    authService.updatePassword(user, PasswordInput.from(Json.parseObject(readBody(exchange))), token);
    sendJson(exchange, 200, Map.of("ok", true));
  }
}

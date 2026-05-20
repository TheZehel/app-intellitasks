package br.edu.intellitasks.controller;

import static br.edu.intellitasks.http.HttpUtils.clearSessionCookie;
import static br.edu.intellitasks.http.HttpUtils.getSessionToken;
import static br.edu.intellitasks.http.HttpUtils.readBody;
import static br.edu.intellitasks.http.HttpUtils.sendJson;
import static br.edu.intellitasks.http.HttpUtils.setSessionCookie;

import br.edu.intellitasks.dto.AuthInput;
import br.edu.intellitasks.http.DtoMapper;
import br.edu.intellitasks.http.Json;
import br.edu.intellitasks.model.User;
import br.edu.intellitasks.service.AuthService;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  public void register(HttpExchange exchange) throws IOException {
    AuthService.AuthResult result = authService.register(AuthInput.register(Json.parseObject(readBody(exchange))));
    setSessionCookie(exchange, result.token());
    sendJson(exchange, 201, Map.of("user", DtoMapper.authUser(result.user())));
  }

  public void login(HttpExchange exchange) throws IOException {
    AuthService.AuthResult result = authService.login(AuthInput.login(Json.parseObject(readBody(exchange))));
    setSessionCookie(exchange, result.token());
    sendJson(exchange, 200, Map.of("user", DtoMapper.authUser(result.user())));
  }

  public void me(HttpExchange exchange) throws IOException {
    User user = authService.currentUser(getSessionToken(exchange)).orElse(null);
    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("user", user == null ? null : DtoMapper.authUser(user));
    sendJson(exchange, 200, payload);
  }

  public void logout(HttpExchange exchange) throws IOException {
    authService.logout(getSessionToken(exchange));
    clearSessionCookie(exchange);
    sendJson(exchange, 200, Map.of("ok", true));
  }

  public void logoutAll(HttpExchange exchange) throws IOException {
    User user = authService.requireUser(getSessionToken(exchange));
    authService.logoutAll(user);
    clearSessionCookie(exchange);
    sendJson(exchange, 200, Map.of("ok", true));
  }
}

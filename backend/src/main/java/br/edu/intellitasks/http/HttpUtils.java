package br.edu.intellitasks.http;

import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

public class HttpUtils {
  public static final String SESSION_COOKIE = "intellitasks_session";

  public static String readBody(HttpExchange exchange) throws IOException {
    return new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
  }

  public static void sendJson(HttpExchange exchange, int status, Object payload) throws IOException {
    applyCors(exchange);
    byte[] body = Json.stringify(payload).getBytes(StandardCharsets.UTF_8);
    exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
    exchange.sendResponseHeaders(status, body.length);
    exchange.getResponseBody().write(body);
    exchange.close();
  }

  public static void sendNoContent(HttpExchange exchange) throws IOException {
    applyCors(exchange);
    exchange.sendResponseHeaders(204, -1);
    exchange.close();
  }

  public static boolean handleOptions(HttpExchange exchange) throws IOException {
    if (!exchange.getRequestMethod().equals("OPTIONS")) {
      return false;
    }

    applyCors(exchange);
    exchange.sendResponseHeaders(204, -1);
    exchange.close();
    return true;
  }

  public static void setSessionCookie(HttpExchange exchange, String token) {
    exchange.getResponseHeaders().add(
      "Set-Cookie",
      SESSION_COOKIE + "=" + token + "; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800"
    );
  }

  public static void clearSessionCookie(HttpExchange exchange) {
    exchange.getResponseHeaders().add(
      "Set-Cookie",
      SESSION_COOKIE + "=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0"
    );
  }

  public static String getSessionToken(HttpExchange exchange) {
    return Optional.ofNullable(exchange.getRequestHeaders().getFirst("Cookie"))
      .flatMap(cookie -> Arrays.stream(cookie.split(";"))
        .map(String::trim)
        .filter(part -> part.startsWith(SESSION_COOKIE + "="))
        .map(part -> part.substring((SESSION_COOKIE + "=").length()))
        .findFirst())
      .orElse("");
  }

  public static Map<String, Object> message(String message) {
    return Map.of("message", message);
  }

  private static void applyCors(HttpExchange exchange) {
    String origin = exchange.getRequestHeaders().getFirst("Origin");
    exchange.getResponseHeaders().set("Access-Control-Allow-Origin", origin == null ? "http://localhost:3000" : origin);
    exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");
    exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  }
}

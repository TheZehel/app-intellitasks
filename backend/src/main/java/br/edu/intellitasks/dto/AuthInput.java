package br.edu.intellitasks.dto;

import java.util.Map;

public record AuthInput(String name, String email, String password, String confirmPassword) {
  public static AuthInput login(Map<String, Object> data) {
    return new AuthInput("", stringValue(data, "email").toLowerCase(), stringValue(data, "password"), "");
  }

  public static AuthInput register(Map<String, Object> data) {
    return new AuthInput(
      stringValue(data, "name").trim(),
      stringValue(data, "email").toLowerCase(),
      stringValue(data, "password"),
      stringValue(data, "confirmPassword")
    );
  }

  private static String stringValue(Map<String, Object> data, String key) {
    Object value = data.get(key);
    return value instanceof String ? ((String) value).trim() : "";
  }
}

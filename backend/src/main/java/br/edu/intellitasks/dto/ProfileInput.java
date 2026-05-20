package br.edu.intellitasks.dto;

import java.util.Map;

public record ProfileInput(String name) {
  public static ProfileInput from(Map<String, Object> data) {
    String name = stringValue(data, "name").trim();

    if (name.isBlank()) {
      throw new IllegalArgumentException("Informe seu nome.");
    }

    return new ProfileInput(name);
  }

  private static String stringValue(Map<String, Object> data, String key) {
    Object value = data.get(key);
    return value instanceof String ? (String) value : "";
  }
}

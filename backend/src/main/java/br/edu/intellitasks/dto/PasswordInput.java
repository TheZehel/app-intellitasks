package br.edu.intellitasks.dto;

import java.util.Map;

public record PasswordInput(String currentPassword, String newPassword, String confirmPassword) {
  public static PasswordInput from(Map<String, Object> data) {
    String currentPassword = stringValue(data, "currentPassword");
    String newPassword = stringValue(data, "newPassword");
    String confirmPassword = stringValue(data, "confirmPassword");

    if (currentPassword.length() < 6) {
      throw new IllegalArgumentException("Informe sua senha atual.");
    }

    if (newPassword.length() < 6) {
      throw new IllegalArgumentException("A nova senha deve ter pelo menos 6 caracteres.");
    }

    if (!newPassword.equals(confirmPassword)) {
      throw new IllegalArgumentException("A confirmacao da nova senha nao confere.");
    }

    return new PasswordInput(currentPassword, newPassword, confirmPassword);
  }

  private static String stringValue(Map<String, Object> data, String key) {
    Object value = data.get(key);
    return value instanceof String ? ((String) value).trim() : "";
  }
}

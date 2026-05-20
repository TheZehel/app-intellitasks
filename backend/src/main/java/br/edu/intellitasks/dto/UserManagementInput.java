package br.edu.intellitasks.dto;

import br.edu.intellitasks.model.UserRole;
import java.util.Map;

public record UserManagementInput(UserRole role, boolean active) {
  public static UserManagementInput from(Map<String, Object> data) {
    UserRole role;

    try {
      role = UserRole.valueOf(String.valueOf(data.getOrDefault("role", "member")));
    } catch (IllegalArgumentException error) {
      throw new IllegalArgumentException("Papel de usuario invalido.");
    }

    Object active = data.get("isActive");

    if (!(active instanceof Boolean)) {
      throw new IllegalArgumentException("Status de usuario invalido.");
    }

    return new UserManagementInput(role, (Boolean) active);
  }
}

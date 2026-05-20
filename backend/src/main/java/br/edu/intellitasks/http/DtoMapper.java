package br.edu.intellitasks.http;

import br.edu.intellitasks.model.Category;
import br.edu.intellitasks.model.Task;
import br.edu.intellitasks.model.User;
import java.util.Map;

public class DtoMapper {
  public static Map<String, Object> category(Category category) {
    return Map.of("id", category.getId(), "name", category.getName(), "color", category.getColor());
  }

  public static Map<String, Object> task(Task task) {
    return Map.of(
      "id", task.getId(),
      "title", task.getTitle(),
      "description", task.getDescription(),
      "categoryId", task.getCategoryId(),
      "status", task.getStatus().name(),
      "dueDate", task.getDueDate()
    );
  }

  public static Map<String, Object> authUser(User user) {
    return Map.of(
      "id", user.getId(),
      "name", user.getName(),
      "email", user.getEmail(),
      "role", user.getRole().name(),
      "isActive", user.isActive(),
      "createdAt", user.getCreatedAt().toString()
    );
  }

  public static Map<String, Object> managedUser(User user) {
    return Map.of(
      "id", user.getId(),
      "name", user.getName(),
      "email", user.getEmail(),
      "role", user.getRole().name(),
      "isActive", user.isActive(),
      "createdAt", user.getCreatedAt().toString(),
      "updatedAt", user.getUpdatedAt().toString()
    );
  }
}

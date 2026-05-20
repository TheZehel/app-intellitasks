package br.edu.intellitasks.dto;

import br.edu.intellitasks.model.TaskStatus;
import java.util.Map;

public record TaskInput(String title, String description, String categoryId, TaskStatus status, String dueDate) {
  public static TaskInput from(Map<String, Object> data) {
    String title = stringValue(data, "title").trim();
    String description = stringValue(data, "description");
    String categoryId = stringValue(data, "categoryId");
    TaskStatus status = parseStatus(stringValue(data, "status"));
    String dueDate = stringValue(data, "dueDate");

    if (title.isBlank()) {
      throw new IllegalArgumentException("Titulo e obrigatorio.");
    }

    if (categoryId.isBlank()) {
      throw new IllegalArgumentException("Categoria e obrigatoria.");
    }

    return new TaskInput(title, description, categoryId, status, dueDate);
  }

  private static TaskStatus parseStatus(String value) {
    try {
      return value.isBlank() ? TaskStatus.pending : TaskStatus.valueOf(value);
    } catch (IllegalArgumentException error) {
      return TaskStatus.pending;
    }
  }

  private static String stringValue(Map<String, Object> data, String key) {
    Object value = data.get(key);
    return value instanceof String ? (String) value : "";
  }
}

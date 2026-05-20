package br.edu.intellitasks.model;

import java.time.Instant;
import java.util.UUID;

public class Task {
  private final String id;
  private String title;
  private String description;
  private String categoryId;
  private TaskStatus status;
  private String dueDate;
  private final Instant createdAt;
  private Instant updatedAt;

  public Task(String title, String description, String categoryId, TaskStatus status, String dueDate) {
    this(UUID.randomUUID().toString(), title, description, categoryId, status, dueDate);
  }

  public Task(String id, String title, String description, String categoryId, TaskStatus status, String dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.categoryId = categoryId;
    this.status = status;
    this.dueDate = dueDate;
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
  }

  public void update(String title, String description, String categoryId, TaskStatus status, String dueDate) {
    this.title = title;
    this.description = description;
    this.categoryId = categoryId;
    this.status = status;
    this.dueDate = dueDate;
    this.updatedAt = Instant.now();
  }

  public void toggleDone() {
    this.status = this.status == TaskStatus.done ? TaskStatus.pending : TaskStatus.done;
    this.updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getDescription() {
    return description;
  }

  public String getCategoryId() {
    return categoryId;
  }

  public TaskStatus getStatus() {
    return status;
  }

  public String getDueDate() {
    return dueDate;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}

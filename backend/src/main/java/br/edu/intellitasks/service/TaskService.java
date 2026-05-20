package br.edu.intellitasks.service;

import br.edu.intellitasks.dto.TaskInput;
import br.edu.intellitasks.model.Task;
import br.edu.intellitasks.model.TaskStatus;
import br.edu.intellitasks.repository.CategoryRepository;
import br.edu.intellitasks.repository.TaskRepository;
import java.util.List;
import java.util.Map;

public class TaskService {
  private final TaskRepository taskRepository;
  private final CategoryRepository categoryRepository;

  public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository) {
    this.taskRepository = taskRepository;
    this.categoryRepository = categoryRepository;
  }

  public List<Task> list(String categoryId, String status) {
    return taskRepository.findAll().stream()
      .filter(task -> categoryId == null || categoryId.equals("all") || task.getCategoryId().equals(categoryId))
      .filter(task -> status == null || status.equals("all") || task.getStatus().name().equals(status))
      .toList();
  }

  public Task create(TaskInput input) {
    ensureCategory(input.categoryId());
    return taskRepository.save(new Task(input.title(), input.description(), input.categoryId(), input.status(), input.dueDate()));
  }

  public Task update(String id, TaskInput input) {
    ensureCategory(input.categoryId());
    Task task = findRequired(id);
    task.update(input.title(), input.description(), input.categoryId(), input.status(), input.dueDate());
    return taskRepository.save(task);
  }

  public Task toggle(String id) {
    Task task = findRequired(id);
    task.toggleDone();
    return taskRepository.save(task);
  }

  public void delete(String id) {
    if (taskRepository.findById(id).isEmpty()) {
      throw new NotFoundException("Tarefa nao encontrada.");
    }
    taskRepository.delete(id);
  }

  public Map<String, Long> summary() {
    List<Task> tasks = taskRepository.findAll();
    long pending = tasks.stream().filter(task -> task.getStatus() == TaskStatus.pending).count();
    long inProgress = tasks.stream().filter(task -> task.getStatus() == TaskStatus.in_progress).count();
    long done = tasks.stream().filter(task -> task.getStatus() == TaskStatus.done).count();

    return Map.of("total", (long) tasks.size(), "pending", pending, "inProgress", inProgress, "done", done);
  }

  private Task findRequired(String id) {
    return taskRepository.findById(id).orElseThrow(() -> new NotFoundException("Tarefa nao encontrada."));
  }

  private void ensureCategory(String categoryId) {
    if (categoryRepository.findById(categoryId).isEmpty()) {
      throw new NotFoundException("Categoria nao encontrada.");
    }
  }
}

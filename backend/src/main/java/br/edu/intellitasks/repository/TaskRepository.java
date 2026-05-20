package br.edu.intellitasks.repository;

import br.edu.intellitasks.model.Task;
import br.edu.intellitasks.model.TaskStatus;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class TaskRepository {
  private final Map<String, Task> tasks = new ConcurrentHashMap<>();

  public TaskRepository() {
    save(new Task("task-1", "Preparar apresentacao MVC", "Organizar exemplos de Model, View e Controller para demonstracao.", "study", TaskStatus.in_progress, "2026-05-22"));
    save(new Task("task-2", "Revisar backlog da semana", "Priorizar tarefas abertas e remover itens duplicados.", "work", TaskStatus.pending, "2026-05-24"));
    save(new Task("task-3", "Confirmar horario da entrega", "Validar data final e separar roteiro da apresentacao.", "urgent", TaskStatus.done, "2026-05-19"));
  }

  public List<Task> findAll() {
    return tasks.values().stream()
      .sorted(Comparator.comparing(Task::getCreatedAt).reversed())
      .toList();
  }

  public Optional<Task> findById(String id) {
    return Optional.ofNullable(tasks.get(id));
  }

  public Task save(Task task) {
    tasks.put(task.getId(), task);
    return task;
  }

  public void delete(String id) {
    tasks.remove(id);
  }
}

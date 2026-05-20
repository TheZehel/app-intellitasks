package br.edu.intellitasks.controller;

import static br.edu.intellitasks.http.HttpUtils.readBody;
import static br.edu.intellitasks.http.HttpUtils.sendJson;

import br.edu.intellitasks.dto.TaskInput;
import br.edu.intellitasks.http.DtoMapper;
import br.edu.intellitasks.http.Json;
import br.edu.intellitasks.model.Task;
import br.edu.intellitasks.service.TaskService;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public class TaskController {
  private final TaskService service;

  public TaskController(TaskService service) {
    this.service = service;
  }

  public void list(HttpExchange exchange) throws IOException {
    Map<String, String> query = query(exchange);
    sendJson(exchange, 200, Map.of(
      "tasks", service.list(query.get("categoryId"), query.get("status")).stream().map(DtoMapper::task).toList(),
      "summary", service.summary()
    ));
  }

  public void create(HttpExchange exchange) throws IOException {
    Task task = service.create(TaskInput.from(Json.parseObject(readBody(exchange))));
    sendJson(exchange, 201, Map.of("task", DtoMapper.task(task), "summary", service.summary()));
  }

  public void update(HttpExchange exchange, String id) throws IOException {
    Task task = service.update(id, TaskInput.from(Json.parseObject(readBody(exchange))));
    sendJson(exchange, 200, Map.of("task", DtoMapper.task(task), "summary", service.summary()));
  }

  public void toggle(HttpExchange exchange, String id) throws IOException {
    Task task = service.toggle(id);
    sendJson(exchange, 200, Map.of("task", DtoMapper.task(task), "summary", service.summary()));
  }

  public void delete(HttpExchange exchange, String id) throws IOException {
    service.delete(id);
    sendJson(exchange, 200, Map.of("summary", service.summary()));
  }

  private Map<String, String> query(HttpExchange exchange) {
    String rawQuery = exchange.getRequestURI().getRawQuery();
    if (rawQuery == null || rawQuery.isBlank()) {
      return Map.of();
    }

    return Arrays.stream(rawQuery.split("&"))
      .map(part -> part.split("=", 2))
      .collect(Collectors.toMap(
        part -> decode(part[0]),
        part -> part.length > 1 ? decode(part[1]) : "",
        (left, right) -> right
      ));
  }

  private String decode(String value) {
    return URLDecoder.decode(value, StandardCharsets.UTF_8);
  }
}

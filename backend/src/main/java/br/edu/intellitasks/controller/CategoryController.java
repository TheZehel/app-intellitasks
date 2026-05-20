package br.edu.intellitasks.controller;

import static br.edu.intellitasks.http.HttpUtils.sendJson;

import br.edu.intellitasks.http.DtoMapper;
import br.edu.intellitasks.repository.CategoryRepository;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.Map;

public class CategoryController {
  private final CategoryRepository repository;

  public CategoryController(CategoryRepository repository) {
    this.repository = repository;
  }

  public void list(HttpExchange exchange) throws IOException {
    sendJson(exchange, 200, Map.of("categories", repository.findAll().stream().map(DtoMapper::category).toList()));
  }
}

package br.edu.intellitasks.repository;

import br.edu.intellitasks.model.Category;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CategoryRepository {
  private final List<Category> categories = new ArrayList<>();

  public CategoryRepository() {
    categories.add(new Category("study", "Estudos", "#028090"));
    categories.add(new Category("work", "Trabalho", "#02C39A"));
    categories.add(new Category("personal", "Pessoal", "#5AB8B6"));
    categories.add(new Category("urgent", "Urgente", "#0B5F6F"));
  }

  public List<Category> findAll() {
    return List.copyOf(categories);
  }

  public Optional<Category> findById(String id) {
    return categories.stream().filter(category -> category.getId().equals(id)).findFirst();
  }
}

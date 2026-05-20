package br.edu.intellitasks.repository;

import br.edu.intellitasks.model.User;
import br.edu.intellitasks.model.UserRole;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class UserRepository {
  private final Map<String, User> users = new ConcurrentHashMap<>();

  public List<User> findAll() {
    return users.values().stream()
      .sorted(Comparator.comparing(User::getCreatedAt))
      .toList();
  }

  public Optional<User> findById(String id) {
    return Optional.ofNullable(users.get(id));
  }

  public Optional<User> findByEmail(String email) {
    return users.values().stream()
      .filter(user -> user.getEmail().equalsIgnoreCase(email))
      .findFirst();
  }

  public User save(User user) {
    users.put(user.getId(), user);
    return user;
  }

  public long count() {
    return users.size();
  }

  public long countActiveAdmins() {
    return users.values().stream()
      .filter(user -> user.getRole() == UserRole.admin && user.isActive())
      .count();
  }
}

package br.edu.intellitasks.model;

import java.time.Instant;
import java.util.UUID;

public class User {
  private final String id;
  private String name;
  private final String email;
  private String passwordHash;
  private UserRole role;
  private boolean active;
  private final Instant createdAt;
  private Instant updatedAt;

  public User(String name, String email, String passwordHash, UserRole role) {
    this.id = UUID.randomUUID().toString();
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role;
    this.active = true;
    this.createdAt = Instant.now();
    this.updatedAt = Instant.now();
  }

  public void updateProfile(String name) {
    this.name = name;
    this.updatedAt = Instant.now();
  }

  public void updatePassword(String passwordHash) {
    this.passwordHash = passwordHash;
    this.updatedAt = Instant.now();
  }

  public void updateManagement(UserRole role, boolean active) {
    this.role = role;
    this.active = active;
    this.updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public UserRole getRole() {
    return role;
  }

  public boolean isActive() {
    return active;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }
}

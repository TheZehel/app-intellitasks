package br.edu.intellitasks.service;

public class ConflictException extends RuntimeException {
  public ConflictException(String message) {
    super(message);
  }
}

package br.edu.intellitasks.service;

import br.edu.intellitasks.dto.UserManagementInput;
import br.edu.intellitasks.model.User;
import br.edu.intellitasks.model.UserRole;
import br.edu.intellitasks.repository.UserRepository;
import java.util.List;

public class UserService {
  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<User> list(User currentUser) {
    ensureAdmin(currentUser);
    return userRepository.findAll();
  }

  public User update(User currentUser, String id, UserManagementInput input) {
    ensureAdmin(currentUser);
    User target = userRepository.findById(id).orElseThrow(() -> new NotFoundException("Usuario nao encontrado."));

    if (target.getRole() == UserRole.admin && target.isActive() && (input.role() != UserRole.admin || !input.active()) && userRepository.countActiveAdmins() <= 1) {
      throw new IllegalArgumentException("Mantenha pelo menos um administrador ativo.");
    }

    target.updateManagement(input.role(), input.active());
    return userRepository.save(target);
  }

  private void ensureAdmin(User user) {
    if (user.getRole() != UserRole.admin) {
      throw new ForbiddenException("Acesso restrito a administradores.");
    }
  }
}

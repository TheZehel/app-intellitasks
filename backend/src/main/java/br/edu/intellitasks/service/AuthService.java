package br.edu.intellitasks.service;

import br.edu.intellitasks.dto.AuthInput;
import br.edu.intellitasks.dto.PasswordInput;
import br.edu.intellitasks.dto.ProfileInput;
import br.edu.intellitasks.model.User;
import br.edu.intellitasks.model.UserRole;
import br.edu.intellitasks.repository.UserRepository;
import java.security.SecureRandom;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class AuthService {
  private final UserRepository userRepository;
  private final PasswordService passwordService;
  private final SecureRandom random = new SecureRandom();
  private final Map<String, String> sessions = new ConcurrentHashMap<>();

  public AuthService(UserRepository userRepository, PasswordService passwordService) {
    this.userRepository = userRepository;
    this.passwordService = passwordService;
  }

  public AuthResult register(AuthInput input) {
    validateRegister(input);

    if (userRepository.findByEmail(input.email()).isPresent()) {
      throw new ConflictException("Este email ja esta cadastrado.");
    }

    UserRole role = userRepository.count() == 0 ? UserRole.admin : UserRole.member;
    User user = userRepository.save(new User(input.name(), input.email(), passwordService.hash(input.password()), role));

    return createResult(user);
  }

  public AuthResult login(AuthInput input) {
    User user = userRepository.findByEmail(input.email())
      .orElseThrow(() -> new UnauthorizedException("Email ou senha invalidos."));

    if (!passwordService.verify(input.password(), user.getPasswordHash())) {
      throw new UnauthorizedException("Email ou senha invalidos.");
    }

    if (!user.isActive()) {
      throw new ForbiddenException("Esta conta esta inativa.");
    }

    return createResult(user);
  }

  public Optional<User> currentUser(String token) {
    if (token == null || token.isBlank()) {
      return Optional.empty();
    }

    return Optional.ofNullable(sessions.get(token))
      .flatMap(userRepository::findById)
      .filter(User::isActive);
  }

  public User requireUser(String token) {
    return currentUser(token).orElseThrow(() -> new UnauthorizedException("Autenticacao obrigatoria."));
  }

  public void logout(String token) {
    if (token != null) {
      sessions.remove(token);
    }
  }

  public void logoutAll(User user) {
    sessions.entrySet().removeIf(entry -> entry.getValue().equals(user.getId()));
  }

  public User updateProfile(User user, ProfileInput input) {
    user.updateProfile(input.name());
    return userRepository.save(user);
  }

  public void updatePassword(User user, PasswordInput input, String currentToken) {
    if (!passwordService.verify(input.currentPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("Senha atual invalida.");
    }

    user.updatePassword(passwordService.hash(input.newPassword()));
    userRepository.save(user);
    sessions.entrySet().removeIf(entry -> entry.getValue().equals(user.getId()) && !entry.getKey().equals(currentToken));
  }

  private AuthResult createResult(User user) {
    String token = createToken();
    sessions.put(token, user.getId());

    return new AuthResult(user, token);
  }

  private String createToken() {
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    return HexFormat.of().formatHex(bytes);
  }

  private void validateRegister(AuthInput input) {
    if (input.name().isBlank()) {
      throw new IllegalArgumentException("Informe seu nome.");
    }

    if (!input.email().contains("@")) {
      throw new IllegalArgumentException("Informe um email valido.");
    }

    if (input.password().length() < 6) {
      throw new IllegalArgumentException("A senha deve ter pelo menos 6 caracteres.");
    }

    if (!input.password().equals(input.confirmPassword())) {
      throw new IllegalArgumentException("A confirmacao de senha nao confere.");
    }
  }

  public record AuthResult(User user, String token) {}
}

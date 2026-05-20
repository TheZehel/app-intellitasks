package br.edu.intellitasks.service;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordService {
  private static final int ITERATIONS = 120_000;
  private static final int KEY_LENGTH = 256;
  private final SecureRandom random = new SecureRandom();

  public String hash(String password) {
    byte[] salt = new byte[16];
    random.nextBytes(salt);

    return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(pbkdf(password, salt));
  }

  public boolean verify(String password, String hash) {
    String[] parts = hash.split(":");

    if (parts.length != 2) {
      return false;
    }

    byte[] salt = Base64.getDecoder().decode(parts[0]);
    byte[] expected = Base64.getDecoder().decode(parts[1]);
    byte[] candidate = pbkdf(password, salt);

    if (candidate.length != expected.length) {
      return false;
    }

    int result = 0;
    for (int index = 0; index < candidate.length; index++) {
      result |= candidate[index] ^ expected[index];
    }

    return result == 0;
  }

  private byte[] pbkdf(String password, byte[] salt) {
    try {
      PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
      return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
    } catch (NoSuchAlgorithmException | InvalidKeySpecException error) {
      throw new IllegalStateException("Nao foi possivel processar a senha.", error);
    }
  }
}

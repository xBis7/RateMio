package com.xbis.daos;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class PasswordUtil {

  public static final int ITERATIONS = 1000;
  public static final int KEY_LENGTH = 512;
  private static final String ALGORITHM = "PBKDF2WithHmacSHA512";
  private static final SecureRandom RAND = new SecureRandom();

  public static String generateSalt() {

    final int length = 4;

    byte[] salt = new byte[length];
    RAND.nextBytes(salt);

    return Base64.getEncoder().encodeToString(salt);
  }

  public static String hashThePassword(String plainTextPassword, String salt) {
    char[] chars = plainTextPassword.toCharArray();
    byte[] bytes = salt.getBytes();
    String hashedPass;

    PBEKeySpec spec = new PBEKeySpec(chars, bytes, ITERATIONS, KEY_LENGTH);
    Arrays.fill(chars, Character.MIN_VALUE);

    try {
      SecretKeyFactory fac = SecretKeyFactory.getInstance(ALGORITHM);
      byte[] securePassword = fac.generateSecret(spec).getEncoded();
      hashedPass = Base64.getEncoder().encodeToString(securePassword);
    } catch (NoSuchAlgorithmException | InvalidKeySpecException ex) {
      return ex.toString();
    } finally {
      spec.clearPassword();
    }
    return hashedPass;
  }

  public static boolean verifyThePassword(String plainTextPassword, String hashedPassword, String salt) {
    String encryptedPass = hashThePassword(plainTextPassword, salt);
    return encryptedPass.equals(hashedPassword);
  }

}
package com.portfolio.service;

import org.springframework.stereotype.Service;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio Avanzado de Criptografía, Saneamiento de Entradas y Retos de Seguridad.
 * Ofrece protección corporativa para mitigar ataques XSS, Spam automatizado y fugas de privacidad.
 */
@Service
public class EncryptionService {

    private final SecretKey secretKey;
    private final IvParameterSpec iv;

    // Almacén seguro para desafíos anti-bot (Math challenges)
    private final Map<String, ChallengeSession> challengeStore = new ConcurrentHashMap<>();

    public EncryptionService() throws Exception {
        // En un entorno productivo real, estas claves se recuperan de variables de entorno seguras.
        // Generamos una clave simétrica segura AES-256 por cada arranque o inicialización.
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(256);
        this.secretKey = keyGen.generateKey();

        byte[] ivBytes = new byte[16];
        new SecureRandom().nextBytes(ivBytes);
        this.iv = new IvParameterSpec(ivBytes);
    }

    /**
     * Sanea un texto para mitigar ataques XSS (Cross Site Scripting).
     * Reemplaza caracteres HTML especiales con sus respectivos HTML entities.
     */
    public String sanitizeInput(String input) {
        if (input == null) return "";
        return input.trim()
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;")
                .replace("/", "&#x2F;");
    }

    /**
     * Encripta un texto sensible utilizando cifrado simétrico robusto AES-256 en modo CBC con padding PKCS5.
     */
    public String encrypt(String plainText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Error crítico al cifrar la información: " + e.getMessage(), e);
        }
    }

    /**
     * Desencripta un texto cifrado en Base64 utilizando la clave simétrica privada.
     */
    public String decrypt(String encryptedText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "[Error de descifrado - Clave obsoleta o datos corruptos]";
        }
    }

    // --- SISTEMA INTERACTIVO ANTI-BOTS ---

    public Map<String, Object> generateChallenge() {
        int num1 = (int) (Math.random() * 9) + 1;
        int num2 = (int) (Math.random() * 9) + 1;
        int sum = num1 + num2;
        String id = UUID.randomUUID().toString();

        // Expira en 5 minutos
        long expiresAt = System.currentTimeMillis() + (5 * 60 * 1000);
        challengeStore.put(id, new ChallengeSession(sum, expiresAt));

        Map<String, Object> challenge = new HashMap<>();
        challenge.put("id", id);
        challenge.put("question", "¿Cuánto es " + num1 + " + " + num2 + "? (Verificación de seguridad)");
        return challenge;
    }

    public boolean verifyChallenge(String id, String answerStr) {
        if (id == null || answerStr == null) return false;
        ChallengeSession session = challengeStore.remove(id); // Eliminar inmediatamente para evitar ataques de replay
        if (session == null || session.isExpired()) return false;

        try {
            int answer = Integer.parseInt(answerStr.trim());
            return answer == session.getAnswer();
        } catch (NumberFormatException e) {
            return false;
        }
    }

    // Estructura interna de sesión de reto de seguridad
    private static class ChallengeSession {
        private final int answer;
        private final long expiresAt;

        public ChallengeSession(int answer, long expiresAt) {
            this.answer = answer;
            this.expiresAt = expiresAt;
        }

        public int getAnswer() { return answer; }
        public boolean isExpired() { return System.currentTimeMillis() > expiresAt; }
    }
}

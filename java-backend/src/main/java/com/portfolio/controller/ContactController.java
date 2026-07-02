package com.portfolio.controller;

import com.portfolio.model.ContactRequest;
import com.portfolio.service.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador de REST API para el reto de seguridad y el envío de mensajes cifrados.
 * Implementa de forma fidedigna la misma firma y especificación de seguridad del entorno Node.js
 */
@RestController
@CrossOrigin(origins = "*") // Permite acoplamientos con servidores dev de React
public class ContactController {

    private final EncryptionService encryptionService;
    
    // Almacén seguro volátil para simular persistencia cifrada con AES-256 en memoria
    private final List<String> encryptedLedger = new ArrayList<>();

    @Autowired
    public ContactController(EncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }

    /**
     * Devuelve el reto matemático de validación anti-bot.
     */
    @GetMapping("/api/security-challenge")
    public ResponseEntity<Map<String, Object>> getChallenge() {
        Map<String, Object> challenge = encryptionService.generateChallenge();
        return ResponseEntity.ok(challenge);
    }

    /**
     * Recibe, valida, sanea y encripta el mensaje del formulario de contacto.
     */
    @PostMapping("/api/contact")
    public ResponseEntity<Map<String, Object>> submitContactForm(@RequestBody ContactRequest request) {
        Map<String, Object> response = new HashMap<>();

        // 1. Detección proactiva de bots mediante Honeypot
        if (request.getHoneypot() != null && !request.getHoneypot().trim().isEmpty()) {
            response.put("error", "Actividad de bot detectada de forma inmediata.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 2. Validación de campos nulos/vacíos
        if (request.getName() == null || request.getEmail() == null || 
            request.getMessage() == null || request.getChallengeId() == null || 
            request.getChallengeAnswer() == null) {
            response.put("error", "Error de Validación: Todos los campos del formulario son requeridos.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 3. Verificación matemática del Reto de Seguridad
        boolean isHuman = encryptionService.verifyChallenge(request.getChallengeId(), request.getChallengeAnswer());
        if (!isHuman) {
            response.put("error", "La respuesta al reto matemático es incorrecta. Compruebe que es humano.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 4. Saneamiento estricto contra ataques XSS
        String cleanName = encryptionService.sanitizeInput(request.getName());
        String cleanEmail = encryptionService.sanitizeInput(request.getEmail());
        String cleanMessage = encryptionService.sanitizeInput(request.getMessage());

        // Validación de formato de correo electrónico corporativo
        String emailRegex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
        if (!cleanEmail.matches(emailRegex)) {
            response.put("error", "Formato de correo electrónico no cumple estándares seguros.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // 5. Cifrado Simétrico AES-256 para preservar la privacidad absoluta de los datos
        String rawData = String.format("{\"name\":\"%s\",\"email\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                cleanName, cleanEmail, cleanMessage, java.time.Instant.now().toString());
        
        String cipherText = encryptionService.encrypt(rawData);
        
        // Guardar en bitácora protegida
        encryptedLedger.add(cipherText);

        // Responder con éxito y retornar el nombre saneado para confirmación visual segura
        response.put("success", true);
        response.put("message", "¡Su mensaje fue recibido con éxito, saneado contra inyecciones e incrementalmente cifrado con AES-256!");
        response.put("sanitizedName", cleanName);

        return ResponseEntity.ok(response);
    }

    /**
     * Bitácora de auditoría segura para Geovanni. Devuelve y desencripta de forma dinámica los logs guardados.
     */
    @GetMapping("/api/audit-messages")
    public ResponseEntity<Map<String, Object>> getAuditLogs() {
        Map<String, Object> response = new HashMap<>();
        List<Map<String, String>> decryptedMessages = new ArrayList<>();

        for (String record : encryptedLedger) {
            try {
                String plainJson = encryptionService.decrypt(record);
                // Simple parsing para construir la respuesta de auditoría
                Map<String, String> parsed = new HashMap<>();
                
                // Extracción sencilla de atributos JSON
                parsed.put("name", extractJsonField(plainJson, "name"));
                parsed.put("email", extractJsonField(plainJson, "email"));
                parsed.put("message", extractJsonField(plainJson, "message"));
                parsed.put("timestamp", extractJsonField(plainJson, "timestamp"));
                
                decryptedMessages.add(parsed);
            } catch (Exception e) {
                // Registro corrupto ignorado por seguridad
            }
        }

        response.put("messages", decryptedMessages);
        return ResponseEntity.ok(response);
    }

    private String extractJsonField(String json, String field) {
        try {
            String pattern = "\"" + field + "\":\"";
            int start = json.indexOf(pattern) + pattern.length();
            int end = json.indexOf("\"", start);
            return json.substring(start, end);
        } catch (Exception e) {
            return "Indefinido";
        }
    }
}

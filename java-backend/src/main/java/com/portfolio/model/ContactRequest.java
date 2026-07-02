package com.portfolio.model;

/**
 * Clase POJO (Plain Old Java Object) que encapsula la petición del formulario de contacto.
 * Incluye el campo invisible honeypot para proteger de rastreos robotizados.
 */
public class ContactRequest {
    private String name;
    private String email;
    private String message;
    private String challengeId;
    private String challengeAnswer;
    private String honeypot; // Campo anti-bot invisible

    // Constructores, Getters y Setters tradicionales para máxima compatibilidad sin Lombok requerido

    public ContactRequest() {}

    public ContactRequest(String name, String email, String message, String challengeId, String challengeAnswer, String honeypot) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.challengeId = challengeId;
        this.challengeAnswer = challengeAnswer;
        this.honeypot = honeypot;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getChallengeId() { return challengeId; }
    public void setChallengeId(String challengeId) { this.challengeId = challengeId; }

    public String getChallengeAnswer() { return challengeAnswer; }
    public void setChallengeAnswer(String challengeAnswer) { this.challengeAnswer = challengeAnswer; }

    public String getHoneypot() { return honeypot; }
    public void setHoneypot(String honeypot) { this.honeypot = honeypot; }
}

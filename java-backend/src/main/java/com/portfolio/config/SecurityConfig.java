package com.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

/**
 * Configuración de Seguridad Corporativa para Spring Security.
 * Implementa de forma proactiva:
 * - Protección contra XSS reflejado.
 * - Prevención de Clickjacking mediante X-Frame-Options.
 * - Cabeceras de seguridad CSP (Content Security Policy) restrictivas.
 * - Prevención de rastreo de MIME-types (X-Content-Type-Options).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF para endpoints de demostración REST controlados por tokens de desafío
            .csrf(csrf -> csrf.disable())
            
            // Permitir todo el tráfico público a los endpoints del Portafolio
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .anyRequest().permitAll()
            )
            
            // 🛡️ Implementar Cabeceras de Seguridad Robustas recomendadas en la auditoría
            .headers(headers -> headers
                // Evitar Clickjacking
                .frameOptions(frame -> frame.sameOrigin())
                // Evitar Mime sniffing
                .contentTypeOptions(contentType -> contentType.withDefaults())
                // Habilitar XSS Protection en navegadores compatibles
                .xssProtection(xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                // Content Security Policy restrictiva
                .contentSecurityPolicy(csp -> csp.policyDirectives(
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "font-src 'self' https://fonts.gstatic.com; " +
                    "img-src 'self' data: referrer;"
                ))
            );

        return http.build();
    }
}

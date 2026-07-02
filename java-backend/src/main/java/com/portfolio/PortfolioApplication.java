package com.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase de entrada principal para el Backend de Spring Boot del Portafolio.
 * Configurado para ejecutarse de forma limpia en Visual Studio Code.
 */
@SpringBootApplication
public class PortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
        System.out.println("=========================================================");
        System.out.println("   SERVIDOR DE SEGURIDAD PORTAFOLIO ACTIVO EN PUERTO 8080 ");
        System.out.println("=========================================================");
    }
}

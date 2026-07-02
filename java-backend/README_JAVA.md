# 🛡️ Servidor Backend Seguro en Java (Spring Boot) - Portafolio y CV Digital

¡Bienvenido, Geovanni! Este directorio contiene la implementación completa, profesional y de nivel corporativo para tu **Servidor Backend en Java**. Ha sido diseñado y estructurado específicamente para ser abierto, compilado y ejecutado directamente desde **Visual Studio Code** (VS Code) o cualquier IDE compatible como IntelliJ IDEA o Eclipse.

## 🚀 Características de Seguridad de Nivel Corporativo Implementadas

Este backend en Java ha sido desarrollado siguiendo las mejores prácticas de ingeniería de software seguro:

1. **Saneamiento Estricto contra Ataques XSS (Cross-Site Scripting)**:
   - Todas las entradas recibidas en el formulario de contacto (Nombre, Correo, Mensaje) son saneadas en el servidor utilizando codificación de entidades HTML en `EncryptionService.java` para prevenir la inyección de scripts maliciosos.

2. **Cifrado Simétrico de Datos Sensibles (AES-256-CBC)**:
   - Para salvaguardar la privacidad absoluta de los remitentes, los mensajes recibidos se cifran de forma simétrica utilizando el estándar AES-256 en modo CBC con un vector de inicialización (IV) criptográficamente seguro. ¡Tus datos nunca se almacenan en texto plano!

3. **Prevención de Clickjacking y MIME-Sniffing (Cabeceras de Seguridad)**:
   - Configuración integrada con `Spring Security` en `SecurityConfig.java` para inyectar cabeceras HTTP robustas como `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, y una estricta política de seguridad de contenido (`Content Security Policy` - CSP).

4. **Sistema Anti-Spam y Verificación Bot (Math Challenge & Honeypot)**:
   - **Honeypot**: Campo de formulario invisible para humanos. Si un script automatizado o bot lo rellena, el servidor rechaza inmediatamente la solicitud.
   - **Desafío Matemático Temporal**: Un reto dinámico de suma simple generado en el servidor, consumido inmediatamente tras la validación para prevenir ataques de replay.

---

## 📂 Estructura Modular de Código

El proyecto sigue una arquitectura limpia de tres capas (Controlador, Servicio, Modelo):

```text
java-backend/
├── pom.xml                                       # Archivo de configuración Maven con dependencias seguras
├── README_JAVA.md                                # Este manual explicativo en español
└── src/
    └── main/
        └── java/
            └── com/
                └── portfolio/
                    ├── PortfolioApplication.java # Clase de entrada principal (Spring Boot Starter)
                    ├── config/
                    │   └── SecurityConfig.java   # Filtros de Spring Security y cabeceras HTTP corporativas
                    ├── controller/
                    │   ├── ContactController.java # Endpoints del formulario de contacto y auditoría cifrada
                    │   └── CvController.java     # Endpoint para transmisión e impresión segura del CV
                    ├── model/
                    │   └── ContactRequest.java   # Modelo del objeto de transferencia de datos (DTO)
                    └── service/
                        └── EncryptionService.java # Núcleo criptográfico, saneador XSS y gestor de retos anti-bot
```

---

## 🛠️ Cómo Abrirlo y Ejecutarlo en Visual Studio Code (VS Code)

Para ejecutar este servidor localmente en tu computadora usando VS Code, sigue estos pasos rápidos:

### 1. Prerrequisitos de Software

Asegúrate de tener instalado en tu sistema:
- **JDK (Java Development Kit)**: Versión 17 o superior.
- **Visual Studio Code**.

### 2. Extensiones recomendadas en VS Code

Abre VS Code, ve a la pestaña de extensiones (`Ctrl+Shift+X` o `Cmd+Shift+X`) e instala las siguientes extensiones oficiales recomendadas:
- **Extension Pack for Java** (de Microsoft).
- **Spring Boot Extension Pack** (de VMware).

### 3. Pasos de Ejecución en VS Code

1. Abre Visual Studio Code.
2. Selecciona **File -> Open Folder...** y abre el directorio raíz del backend: `/java-backend` (donde se encuentra el archivo `pom.xml`).
3. VS Code detectará el proyecto Maven e iniciará la sincronización de dependencias automáticamente (verás una barra de progreso en la esquina inferior derecha).
4. Abre el archivo de entrada principal:
   `src/main/java/com/portfolio/PortfolioApplication.java`
5. Sobre el método `main`, verás una pequeña etiqueta interactiva que dice **Run | Debug**. Haz clic en **Run**.
6. El servidor de Spring Boot se compilará y levantará en tu terminal local en el puerto `8080`.

---

## 📋 APIs y Endpoints Disponibles

Este backend proporciona exactamente las mismas firmas de API que se ejecutan en la versión en vivo de tu portafolio, lo que facilita una transición directa o integración simétrica:

* **GET `http://localhost:8080/api/security-challenge`**: Devuelve un desafío matemático dinámico temporal y su ID de sesión único.
* **POST `http://localhost:8080/api/contact`**: Recibe y valida los parámetros del formulario, mitigando spam por honeypot, resolviendo el reto y cifrando el registro con AES-256.
* **GET `http://localhost:8080/api/audit-messages`**: Endpoint seguro para que Geovanni audite y visualice de forma descifrada y en tiempo real los mensajes recibidos.
* **GET `http://localhost:8080/api/download-cv`**: Envía al navegador de forma segura tu CV profesional en formato imprimible de alta calidad, listo para su uso.

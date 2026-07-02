# Guía para abrir y ejecutar tu Portafolio en Visual Studio Code (VS Code)

¡Hola Geovanni! He diseñado tu portafolio de dos maneras complementarias para que puedas usarlo en **Visual Studio Code (VS Code)** de inmediato, dependiendo de lo que desees mostrar:

1. **La Aplicación Web Interactiva (React + TypeScript):** La versión moderna y visualmente asombrosa que incluye los simuladores interactivos de logística, inventarios y redes.
2. **La Aplicación de Escritorio en Java (Java Swing):** Una versión nativa programada completamente en **Java** (`PortfolioApp.java`) que puedes ejecutar en VS Code con un solo clic.

---

## 🛠️ Paso 1: Descargar tu Código
1. Ve al menú superior o de configuración en Google AI Studio.
2. Elige la opción **Export to ZIP** (Exportar a ZIP) para descargar todo el proyecto a tu computadora.
3. Descomprime el archivo `.zip` en una carpeta que recuerdes (por ejemplo, en tu Escritorio).

---

## 💻 Paso 2: Abrir en Visual Studio Code
1. Abre **Visual Studio Code**.
2. Ve a **Archivo** > **Abrir carpeta...** (File > Open Folder...).
3. Selecciona la carpeta descomprimida del proyecto y haz clic en abrir.

---

## ☕ Opción A: Ejecutar la Versión de Escritorio en Java (Recomendado para tus clases/VS Code)
He creado un programa nativo en Java llamado `PortfolioApp.java` en la raíz de tu proyecto. Cuenta con una interfaz gráfica estilizada basada en tu tema oscuro, pestañas de información y un **Simulador CCNA Interactivo** programado en Java Swing.

### Cómo ejecutarlo en VS Code:
1. Instala la extensión oficial **Extension Pack for Java** de Microsoft en VS Code (puedes buscarla en la pestaña de extensiones a la izquierda).
2. Haz clic en el archivo `PortfolioApp.java` en el explorador de archivos.
3. Presiona el botón de **Run** (Ejecutar) o **Debug** que aparecerá en la esquina superior derecha del archivo, o simplemente presiona `F5`.
4. ¡Listo! Se abrirá una hermosa aplicación de escritorio con tu portafolio profesional.

---

## 🌐 Opción B: Ejecutar la Versión Web Interactiva (React + Vite)
Esta es la versión web completa que se muestra en el navegador con animaciones y mapas táctiles.

### Cómo ejecutarla en VS Code:
1. Asegúrate de tener instalado **Node.js** en tu computadora (puedes descargarlo gratis desde [nodejs.org](https://nodejs.org/)).
2. Abre la terminal integrada de VS Code presionando las teclas `` Ctrl + ` `` (o ve a **Terminal** > **Nueva Terminal**).
3. Instala las dependencias del proyecto escribiendo el siguiente comando en la terminal y presionando Enter:
   ```bash
   npm install
   ```
4. Una vez terminada la instalación, inicia el servidor de desarrollo local con:
   ```bash
   npm run dev
   ```
5. La terminal te dará un enlace (normalmente `http://localhost:3000` o `http://localhost:5173`). Haz **Ctrl + Clic** sobre el enlace para abrir tu portafolio interactivo en tu navegador web.

---

## 📝 Resumen del Contenido Actualizado:
- **Sin dirección completa ni teléfono:** Protegimos tu privacidad en línea cambiando la dirección a la ciudad ("Tulancingo de Bravo, Hidalgo, México") y ocultando el número telefónico ("Disponible bajo solicitud").
- **Lenguaje accesible y profesional:** Modificamos las descripciones técnicas de tus competencias para usar un lenguaje más claro, amigable y práctico, ideal para cualquier tipo de reclutador o cliente.

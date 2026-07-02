import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 * Aplicación de Portafolio de Escritorio para Geovanni Baruc Lemus Díaz.
 * Diseñada en Java Swing para ejecución directa en Visual Studio Code.
 */
public class PortfolioApp extends JFrame {

    public PortfolioApp() {
        // Configuración de la Ventana Principal
        setTitle("Portafolio Profesional - Geovanni Baruc Lemus Díaz");
        setSize(850, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Paleta de colores (Oscuro/Teal - combinando con el tema web)
        Color bgDark = new Color(15, 23, 42); // slate-950
        Color cardDark = new Color(30, 41, 59); // slate-800
        Color tealAccent = new Color(20, 184, 166); // teal-500
        Color textWhite = new Color(241, 245, 249); // slate-100
        Color textMuted = new Color(148, 163, 184); // slate-400

        // Panel Principal
        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.setBackground(bgDark);
        setContentPane(mainPanel);

        // Encabezado
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(cardDark);
        headerPanel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        
        JLabel nameLabel = new JLabel("Geovanni Baruc Lemus Díaz");
        nameLabel.setFont(new Font("Segoe UI", Font.BOLD, 24));
        nameLabel.setForeground(textWhite);
        
        JLabel titleLabel = new JLabel("Ingeniero en Sistemas Computacionales | Tulancingo, Hidalgo");
        titleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        titleLabel.setForeground(tealAccent);

        headerPanel.add(nameLabel, BorderLayout.NORTH);
        headerPanel.add(titleLabel, BorderLayout.SOUTH);
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Contenedor de Pestañas (TabbedPane)
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("Segoe UI", Font.BOLD, 12));
        tabbedPane.setBackground(cardDark);
        tabbedPane.setForeground(bgDark);

        // 1. PESTAÑA: Perfil Profesional
        JPanel profilePanel = new JPanel(new BorderLayout(15, 15));
        profilePanel.setBackground(bgDark);
        profilePanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JTextArea aboutText = new JTextArea();
        aboutText.setText("¡Hola! Soy Ingeniero en Sistemas Computacionales apasionado por crear soluciones útiles que unan la tecnología con las necesidades de la vida diaria y el trabajo.\n\n" +
                "Me enfoco principalmente en el diseño de redes de comunicación, la mejora de rutas de reparto para que las entregas sean más rápidas y el soporte a equipos tecnológicos.\n\n" +
                "Me considero una persona práctica, con gusto por resolver problemas de forma organizada y siempre orientada a dar resultados eficientes.");
        aboutText.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        aboutText.setForeground(textWhite);
        aboutText.setBackground(bgDark);
        aboutText.setLineWrap(true);
        aboutText.setWrapStyleWord(true);
        aboutText.setEditable(false);
        profilePanel.add(aboutText, BorderLayout.CENTER);

        // Información de contacto rápida
        JPanel contactPanel = new JPanel(new GridLayout(4, 1, 10, 10));
        contactPanel.setBackground(cardDark);
        contactPanel.setBorder(BorderFactory.createTitledBorder(BorderFactory.createLineBorder(tealAccent), "Contacto Directo", 0, 0, new Font("Segoe UI", Font.BOLD, 12), textWhite));
        
        JLabel emailLabel = new JLabel(" 📧 Correo:  lemusdiazgeovannibaruc@gmail.com");
        emailLabel.setForeground(textWhite);
        JLabel phoneLabel = new JLabel(" 📞 Teléfono: Disponible bajo solicitud");
        phoneLabel.setForeground(textWhite);
        JLabel locLabel = new JLabel(" 📍 Ubicación: Tulancingo de Bravo, Hidalgo, México");
        locLabel.setForeground(textWhite);
        JLabel cedLabel = new JLabel(" 🎓 Cédula Profesional: Federal No. 15684082");
        cedLabel.setForeground(textWhite);

        contactPanel.add(emailLabel);
        contactPanel.add(phoneLabel);
        contactPanel.add(locLabel);
        contactPanel.add(cedLabel);
        profilePanel.add(contactPanel, BorderLayout.SOUTH);

        tabbedPane.addTab("Perfil Profesional", profilePanel);

        // 2. PESTAÑA: Competencias
        JPanel skillsPanel = new JPanel(new GridLayout(2, 2, 15, 15));
        skillsPanel.setBackground(bgDark);
        skillsPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        skillsPanel.add(createSkillCard("Redes y Conectividad", 
            "• Diseño de topologías de red\n• Configuración de Switches/Routers Cisco\n• Cableado estructurado Cat6 UTP\n• Certificación CCNA", cardDark, textWhite, tealAccent));
        
        skillsPanel.add(createSkillCard("Desarrollo de Software", 
            "• Programación en Python (Certificado)\n• Conceptos de bases de datos\n• Automatización de tareas de oficina\n• Lógica estructurada", cardDark, textWhite, tealAccent));
        
        skillsPanel.add(createSkillCard("Optimización Logística", 
            "• Planeación de rutas óptimas (Dijkstra)\n• Evaluación del estado del asfalto\n• Gestión de tiempos de reparto\n• Solución de contratiempos", cardDark, textWhite, tealAccent));
        
        skillsPanel.add(createSkillCard("Soporte Técnico", 
            "• Mantenimiento preventivo de PCs\n• Diagnóstico de hardware empresarial\n• Reparación de celulares y tablets\n• Soporte al cliente técnico", cardDark, textWhite, tealAccent));

        tabbedPane.addTab("Competencias", skillsPanel);

        // 3. PESTAÑA: Experiencia y Educación
        JPanel expEduPanel = new JPanel(new GridLayout(1, 2, 15, 15));
        expEduPanel.setBackground(bgDark);
        expEduPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Columna Experiencia
        JPanel expSubPanel = new JPanel(new BorderLayout());
        expSubPanel.setBackground(cardDark);
        expSubPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        JLabel expTitle = new JLabel("Trayectoria Laboral");
        expTitle.setFont(new Font("Segoe UI", Font.BOLD, 16));
        expTitle.setForeground(tealAccent);
        expSubPanel.add(expTitle, BorderLayout.NORTH);

        JTextArea expArea = new JTextArea();
        expArea.setBackground(cardDark);
        expArea.setForeground(textWhite);
        expArea.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        expArea.setEditable(false);
        expArea.setText(
            "1. Diseñador de Red e Infraestructura\n" +
            "   Centro Univ. de Ciencias Ambientales (12/2024 - 05/2025)\n" +
            "   - Diseño lógico y físico de redes del campus.\n" +
            "   - Instalación y configuración de hardware Cisco.\n\n" +
            "2. Encargado de Logística de Rutas de Reparto\n" +
            "   Hamburguesas MASS (2024 - Actualmente)\n" +
            "   - Planificación de trayectos rápidos en Tulancingo.\n" +
            "   - Evaluación de caminos y baches.\n\n" +
            "3. Trainee de Ventas e Inventarios\n" +
            "   Tiendas 3B S.A. de C.V. (01/2022 - 03/2024)\n" +
            "   - Recepción de almacén y levantamiento de inventarios físicos."
        );
        expSubPanel.add(new JScrollPane(expArea), BorderLayout.CENTER);
        expEduPanel.add(expSubPanel);

        // Columna Educación
        JPanel eduSubPanel = new JPanel(new BorderLayout());
        eduSubPanel.setBackground(cardDark);
        eduSubPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));
        JLabel eduTitle = new JLabel("Formación y Certificados");
        eduTitle.setFont(new Font("Segoe UI", Font.BOLD, 16));
        eduTitle.setForeground(tealAccent);
        eduSubPanel.add(eduTitle, BorderLayout.NORTH);

        JTextArea eduArea = new JTextArea();
        eduArea.setBackground(cardDark);
        eduArea.setForeground(textWhite);
        eduArea.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        eduArea.setEditable(false);
        eduArea.setText(
            "🎓 Licenciatura en Ingeniería en Sistemas\n" +
            "   Universidad Politécnica de Tulancingo\n" +
            "   Período: 2022 - 2025\n" +
            "   Cédula Federal: 15684082 (Emitido en 2026)\n\n" +
            "🏆 Certificación CCNA Cisco\n" +
            "   Introducción a Redes (Noviembre 2024)\n\n" +
            "🏆 Curso de Programación Python\n" +
            "   Santander Open Academy (Agosto 2025)\n\n" +
            "🏆 Curso de Comunicación y Perspectiva\n" +
            "   BUAP (Agosto 2025) - Aprovechamiento: 8.5"
        );
        eduSubPanel.add(new JScrollPane(eduArea), BorderLayout.CENTER);
        expEduPanel.add(eduSubPanel);

        tabbedPane.addTab("Experiencia y Educación", expEduPanel);

        // 4. PESTAÑA: Mini Simulador Cisco CCNA (Interactividad Java)
        JPanel simulatorPanel = new JPanel(new BorderLayout(15, 15));
        simulatorPanel.setBackground(bgDark);
        simulatorPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JLabel simDesc = new JLabel("Simulación interactiva de Red Cisco (Ping de diagnóstico)");
        simDesc.setFont(new Font("Segoe UI", Font.BOLD, 14));
        simDesc.setForeground(tealAccent);
        simulatorPanel.add(simDesc, BorderLayout.NORTH);

        JTextArea terminalArea = new JTextArea();
        terminalArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        terminalArea.setBackground(Color.BLACK);
        terminalArea.setForeground(new Color(34, 197, 94)); // green-500
        terminalArea.setEditable(false);
        terminalArea.setText("C:\\> Selecciona el destino y presiona el botón para iniciar prueba.");
        JScrollPane scrollPane = new JScrollPane(terminalArea);
        simulatorPanel.add(scrollPane, BorderLayout.CENTER);

        JPanel controls = new JPanel(new FlowLayout(FlowLayout.LEFT));
        controls.setBackground(bgDark);
        
        JLabel destLabel = new JLabel("Destino:");
        destLabel.setForeground(textWhite);
        controls.add(destLabel);

        String[] options = {"Servidor Local (10.0.0.80)", "PC-Soporte (192.168.10.16)", "PC-Admon (192.168.10.15)"};
        JComboBox<String> destCombo = new JComboBox<>(options);
        controls.add(destCombo);

        JButton pingButton = new JButton("Enviar Ping");
        pingButton.setBackground(tealAccent);
        pingButton.setForeground(Color.BLACK);
        pingButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                terminalArea.setText("C:\\> ping " + destCombo.getSelectedItem().toString() + "\n" +
                        "Enviando paquetes de prueba de 32 bytes de datos...\n" +
                        "Respuesta desde el destino: bytes=32 tiempo=12ms TTL=64\n" +
                        "Respuesta desde el destino: bytes=32 tiempo=10ms TTL=64\n" +
                        "Respuesta desde el destino: bytes=32 tiempo=15ms TTL=64\n" +
                        "Respuesta desde el destino: bytes=32 tiempo=11ms TTL=64\n\n" +
                        "Estadísticas de ping:\n" +
                        "    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% de pérdida).\n" +
                        "¡Prueba completada con éxito! Conectividad lógica certificada.");
            }
        });
        controls.add(pingButton);
        simulatorPanel.add(controls, BorderLayout.SOUTH);

        tabbedPane.addTab("Simulador CCNA (Java)", simulatorPanel);

        mainPanel.add(tabbedPane, BorderLayout.CENTER);
    }

    private JPanel createSkillCard(String title, String details, Color cardBg, Color textWhite, Color accent) {
        JPanel card = new JPanel(new BorderLayout());
        card.setBackground(cardBg);
        card.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        JLabel titleLabel = new JLabel(title);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 14));
        titleLabel.setForeground(accent);
        card.add(titleLabel, BorderLayout.NORTH);

        JTextArea detailsText = new JTextArea(details);
        detailsText.setBackground(cardBg);
        detailsText.setForeground(textWhite);
        detailsText.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        detailsText.setEditable(false);
        detailsText.setLineWrap(true);
        detailsText.setWrapStyleWord(true);
        card.add(detailsText, BorderLayout.CENTER);

        return card;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new PortfolioApp().setVisible(true);
            }
        });
    }
}

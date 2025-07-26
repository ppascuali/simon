# Juego Simon - PWA

Este proyecto es una implementación web del clásico juego Simon, desarrollado en HTML, CSS y JavaScript puro, convertido en una **Progressive Web App (PWA)**.

## 🎮 ¿Cómo jugar?

1. Ingresa tu nombre en el campo correspondiente (obligatorio).
2. Haz clic en "Comenzar" para iniciar el juego.
3. Observa la secuencia de colores y sonidos.
4. Repite la secuencia haciendo clic en los botones de colores.
5. Cada vez que aciertes, la secuencia se hará más larga.
6. Si te equivocas, puedes repetir la secuencia y volver a intentarlo.
7. Si superas el récord, tu nombre quedará registrado junto al puntaje más alto.

## ✨ Características

### Juego
- Sonidos originales de notas musicales (DO, RE, MI, FA) según la escala de LA 440.
- Animaciones visuales y de fondo para feedback.
- Melodía especial al superar el récord.
- Guardado de récord y nombre en el navegador (localStorage).
- Interfaz moderna y responsiva.

### PWA (Progressive Web App)
- **Instalable**: Se puede instalar como una aplicación nativa en dispositivos móviles y de escritorio.
- **Funcionamiento offline**: El juego funciona sin conexión a internet.
- **Actualizaciones automáticas**: Notificaciones cuando hay nuevas versiones disponibles.
- **Iconos adaptativos**: Iconos que se adaptan a diferentes tamaños y plataformas.
- **Pantalla completa**: Se ejecuta en modo standalone sin la barra del navegador.
- **Notificaciones push**: Soporte para notificaciones (preparado para futuras funcionalidades).

## 📁 Archivos principales

- `index.html`: Estructura de la interfaz con meta tags PWA.
- `style.css`: Estilos visuales y animaciones.
- `script.js`: Lógica del juego, sonidos y funcionalidades PWA.
- `manifest.json`: Configuración de la PWA (iconos, colores, nombre, etc.).

## 🚀 Instalación como PWA

### En móviles (Android/iOS):
1. Abre el juego en Chrome/Safari.
2. Busca el botón "📱 Instalar App" o usa el menú del navegador.
3. Selecciona "Agregar a pantalla de inicio" o "Instalar aplicación".

### En escritorio (Chrome/Edge):
1. Abre el juego en el navegador.
2. Haz clic en el icono de instalación en la barra de direcciones.
3. Selecciona "Instalar".

## 🔧 Requisitos

- Navegador web moderno con soporte para PWA.
- Para funcionalidad completa: Chrome, Edge, Firefox, Safari (iOS 11.3+).
- No requiere instalación ni dependencias externas.

## 📱 Funcionalidades PWA

### Manifest
- Configuración completa de la aplicación.
- Iconos en múltiples tamaños.
- Colores de tema y fondo.
- Accesos directos (shortcuts).

### Instalación
- Detección automática de capacidad de instalación.
- Botón flotante de instalación.
- Manejo de eventos de instalación.

## 🎯 Próximas funcionalidades

- [ ] Notificaciones push para recordatorios de juego.
- [ ] Sincronización de récords entre dispositivos.
- [ ] Modo multijugador offline.
- [ ] Temas visuales adicionales.

## 👨‍💻 Autor

- Desarrollado con ayuda de IA y aprendizaje de JavaScript.
- Convertido a PWA para mejor experiencia de usuario. 
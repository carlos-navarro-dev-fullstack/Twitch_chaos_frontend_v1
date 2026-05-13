# 🎮 Twitch Game Frontend

Frontend de una app tipo Twitch Game donde los usuarios pueden unirse a salas, votar en tiempo real y ver resultados instantáneos mediante WebSockets.

---

## 🚀 Tecnologías

- React + Vite
- JavaScript (ES6+)
- Fetch API
- WebSockets (SockJS + STOMP)

---

## ⚙️ Funcionalidades

- Crear y unirse a salas de juego
- Registro de usuarios en sesión (localStorage)
- Votación en tiempo real
- Actualización de estado vía WebSocket
- Visualización dinámica de resultados

---

## 🌐 Configuración del backend

Crear archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=https://tu-backend.dominio.com
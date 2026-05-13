import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/api";
import { useGameStore } from "../store/gameStore";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const navigate = useNavigate();

  async function handleCreate() {
    if (!username.trim()) {
      alert("Ingresa un username");
      return;
    }

    localStorage.setItem("username", username.trim());

    try {
      const roomId = await createRoom();
      console.log("ROOM CREATED:", roomId);

      useGameStore.getState().resetGame();

      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error(err);
      alert("Error creando sala");
    }
  }

  function handleJoinRoom() {
    console.log("🟡 [JOIN] intento de unión");
    console.log("👤 username:", username);
    console.log("🏠 room:", roomIdInput);

    if (!username.trim()) {
      alert("Escribe un username primero");
      return;
    }

    if (!roomIdInput.trim()) {
      alert("Escribe el ID de la sala");
      return;
    }

    localStorage.setItem("username", username.trim());

    useGameStore.getState().resetGame();

    navigate(`/room/${roomIdInput.trim()}`);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 TWITCH CHAOS</h1>

      <input
        style={styles.input}
        placeholder="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div style={styles.card}>
        <h3>Crear sala</h3>
        <button style={styles.button} onClick={handleCreate}>
          Crear Sala
        </button>
      </div>

      <div style={styles.card}>
        <h3>Unirse a sala</h3>

        <input
          style={styles.input}
          placeholder="roomId"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
        />

        <button style={styles.button} onClick={handleJoinRoom}>
          Unirse
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: 30,
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },

  title: {
    marginBottom: 20,
  },

  card: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    background: "#111",
    color: "white",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: "20%",
  },

  button: {
    padding: 10,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: "#6026e8",
    color: "white",
    fontWeight: "bold",
  },
};
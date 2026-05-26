import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoom } from "../services/api";
import { useGameStore } from "../store/gameStore";

import { styles } from "../styles/homePage.styles";

export default function HomePage() {

  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState("error");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  async function handleCreate() {

    if (!username.trim()) {

      setMessage("Ingresa un username");
      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    setLoading(true);

    localStorage.setItem(
      "username",
      username.trim()
    );

    try {

      await new Promise((r) =>
        setTimeout(r, 800)
      );

      const roomId =
        await createRoom();

      useGameStore
        .getState()
        .resetGame();

      navigate(`/room/${roomId}`);

    } catch (err) {

      console.error(err);

      setMessage(
        "Servidor despertando... intenta otra vez"
      );

      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 4000);

    } finally {

      setLoading(false);
    }
  }

  function handleJoinRoom() {

    if (!username.trim()) {

      setMessage(
        "Ingresa el username primero"
      );

      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    if (!roomIdInput.trim()) {

      setMessage(
        "Escribe el ID de la sala"
      );

      setMessageType("error");

      setTimeout(() => {
        setMessage("");
      }, 3000);

      return;
    }

    localStorage.setItem(
      "username",
      username.trim()
    );

    useGameStore
      .getState()
      .resetGame();

    navigate(
      `/room/${roomIdInput.trim()}`
    );
  }

  return (

    <div style={styles.page}>

      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      <div style={styles.container}>

        {/* LEFT */}
        <div style={styles.left}>

          <div style={styles.badge}>
            🔥 El juego caótico para streamers
          </div>

          <h1 style={styles.title}>
            STREAMER
            <span style={styles.titleGradient}>
              {" "}CHAOS
            </span>
          </h1>

          <p style={styles.subtitle}>
            Tu chat decide tu destino.
            <br />
            Sobrevive a cancelaciones,
            dramas y funas en vivo.
          </p>

          <div style={styles.statsRow}>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>
                2.3K
              </div>

              <div style={styles.statLabel}>
                VIEWERS
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>
                98%
              </div>

              <div style={styles.statLabel}>
                CAOS
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>
                LIVE
              </div>

              <div style={styles.statLabel}>
                STREAM
              </div>
            </div>

          </div>

          <div style={styles.previewCard}>

            <div style={styles.previewTop}>
              <span style={styles.liveDot}></span>
              CHAT DECIDIENDO...
            </div>

            <div style={styles.previewQuestion}>
              “Te funan por un clip viejo”
            </div>

            <div style={styles.voteOption}>
              <span>Pedir disculpas</span>
              <span>62%</span>
            </div>

            <div style={styles.voteBar}>
              <div style={styles.voteFill}></div>
            </div>

            <div style={styles.voteOption}>
              <span>Ignorar</span>
              <span>25%</span>
            </div>

            <div style={styles.voteBar}>

              <div
                style={{
                  ...styles.voteFill,
                  width: "25%",
                  background: "#ff4ecd",
                }}
              ></div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div style={styles.right}>

          <h2 style={styles.panelTitle}>
            ENTRAR AL CAOS
          </h2>

          <input
            style={styles.input}
            placeholder="Tu username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          {/* CREATE */}
          <div style={styles.card}>

            <div>

              <h3 style={styles.cardTitle}>
                🎥 Crear Sala
              </h3>

              <p style={styles.cardText}>
                Inicia una partida y deja
                que tu chat controle todo.
              </p>

            </div>

            <button
              style={{
                ...styles.createButton,

                opacity:
                  loading ? 0.7 : 1,

                cursor:
                  loading
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={handleCreate}
              disabled={loading}
            >

              {
                loading
                  ? "⏳ INICIANDO STREAM..."
                  : "CREAR SALA"
              }

            </button>

          </div>

          {/* JOIN */}
          <div style={styles.card}>

            <div>

              <h3 style={styles.cardTitle}>
                👥 Unirse
              </h3>

              <p style={styles.cardText}>
                Participa en las votaciones
                del stream.
              </p>

            </div>

            <input
              style={styles.input}
              placeholder="Código de sala"
              value={roomIdInput}
              onChange={(e) =>
                setRoomIdInput(e.target.value)
              }
            />

            <button
              style={styles.joinButton}
              onClick={handleJoinRoom}
            >
              UNIRSE
            </button>

          </div>

        </div>

      </div>

      {message && (

        <div
          style={{
            ...styles.message,

            background:
              messageType === "error"
                ? "rgba(255,0,80,0.15)"
                : "rgba(0,255,140,0.15)",

            border:
              messageType === "error"
                ? "1px solid rgba(255,0,80,0.5)"
                : "1px solid rgba(0,255,140,0.5)",
          }}
        >
          {message}
        </div>
      )}

      {loading && (

        <div style={styles.loadingOverlay}>

          <div style={styles.loadingSpinner}></div>

          <div style={styles.loadingText}>
            Conectando al stream...
          </div>

        </div>
      )}

    </div>
  );
}
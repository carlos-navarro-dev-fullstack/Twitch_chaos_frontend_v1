import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../services/api";
import { useGameStore } from "../store/gameStore";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

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

    localStorage.setItem("username", username.trim());

    try {

      // 👇 pequeño delay visual
      await new Promise((r) => setTimeout(r, 800));

      const roomId = await createRoom();

      useGameStore.getState().resetGame();

      navigate(`/room/${roomId}`);

    } catch (err) {

      console.error(err);

      setMessage("Servidor despertando... intenta otra vez");
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
      setMessage("Ingresa el username primero");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setMessageType("error");
      return;
    }

    if (!roomIdInput.trim()) {
      setMessage("Escribe el ID de la sala");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setMessageType("error");
      return;
    }

    localStorage.setItem("username", username.trim());

    useGameStore.getState().resetGame();

    navigate(`/room/${roomIdInput.trim()}`);
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
            <span style={styles.titleGradient}> CHAOS</span>
          </h1>

          <p style={styles.subtitle}>
            Tu chat decide tu destino.
            <br />
            Sobrevive a cancelaciones, dramas y funas en vivo.
          </p>

          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>2.3K</div>
              <div style={styles.statLabel}>VIEWERS</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>98%</div>
              <div style={styles.statLabel}>CAOS</div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statNumber}>LIVE</div>
              <div style={styles.statLabel}>STREAM</div>
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
          <h2 style={styles.panelTitle}>ENTRAR AL CAOS</h2>

          <input
            style={styles.input}
            placeholder="Tu username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* CREATE */}
          <div style={styles.card}>
            <div>
              <h3 style={styles.cardTitle}>🎥 Crear Sala</h3>

              <p style={styles.cardText}>
                Inicia una partida y deja que tu chat controle todo.
              </p>
            </div>

            <button
              style={{
                ...styles.createButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleCreate}
              disabled={loading}
            >
              {loading
                ? "⏳ INICIANDO STREAM..."
                : "CREAR SALA"}
            </button>
          </div>

          {/* JOIN */}
          <div style={styles.card}>
            <div>
              <h3 style={styles.cardTitle}>👥 Unirse</h3>

              <p style={styles.cardText}>
                Participa en las votaciones del stream.
              </p>
            </div>

            <input
              style={styles.input}
              placeholder="Código de sala"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
            />

            <button style={styles.joinButton} onClick={handleJoinRoom}>
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

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #5b21b6 0%, #0a0a0a 40%)",
    color: "white",
    overflow: "hidden",
    position: "relative",
    fontFamily: "Inter, sans-serif",
  },

  backgroundGlow1: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "#7c3aed",
    filter: "blur(140px)",
    opacity: 0.25,
    top: -100,
    left: -100,
  },

  backgroundGlow2: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "#ec4899",
    filter: "blur(140px)",
    opacity: 0.2,
    bottom: -100,
    right: -100,
  },

  container: {
    position: "relative",
    zIndex: 2,
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    alignItems: "center",
    gap: 60,
    padding: "60px 8%",
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: 30,
  },

  badge: {
    width: "fit-content",
    background: "rgba(124,58,237,0.2)",
    border: "1px solid rgba(167,139,250,0.4)",
    padding: "10px 18px",
    borderRadius: 999,
    fontWeight: 700,
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: 88,
    fontWeight: 900,
    lineHeight: 0.9,
    margin: 0,
    letterSpacing: -3,
  },

  titleGradient: {
    background: "linear-gradient(90deg,#a855f7,#ff4ecd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subtitle: {
    fontSize: 22,
    color: "#d4d4d8",
    lineHeight: 1.6,
    maxWidth: 700,
  },

  statsRow: {
    display: "flex",
    gap: 20,
  },

  statCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "20px 28px",
    borderRadius: 24,
    backdropFilter: "blur(14px)",
    minWidth: 120,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 900,
  },

  statLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#a1a1aa",
    marginTop: 6,
  },

  previewCard: {
    marginTop: 10,
    background: "rgba(17,17,17,0.75)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 28,
    width: 500,
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 40px rgba(168,85,247,0.2)",
  },

  previewTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 800,
    color: "#f472b6",
    marginBottom: 20,
  },

  liveDot: {
    width: 10,
    height: 10,
    background: "#ff004c",
    borderRadius: "50%",
    boxShadow: "0 0 12px #ff004c",
  },

  previewQuestion: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 25,
  },

  voteOption: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    fontWeight: 700,
  },

  voteBar: {
    width: "100%",
    height: 12,
    background: "#27272a",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },

  voteFill: {
    width: "62%",
    height: "100%",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    borderRadius: 999,
  },

  right: {
    background: "rgba(10,10,10,0.75)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 36,
    padding: 40,
    backdropFilter: "blur(20px)",
    display: "flex",
    flexDirection: "column",
    gap: 25,
    boxShadow: "0 0 50px rgba(0,0,0,0.5)",
  },

  panelTitle: {
    fontSize: 38,
    fontWeight: 900,
    margin: 0,
  },

  input: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    border: "1px solid #3f3f46",
    background: "#111",
    color: "white",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  },

  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  cardTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
  },

  cardText: {
    color: "#a1a1aa",
    marginTop: 8,
    lineHeight: 1.5,
  },

  createButton: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
    color: "white",
    fontWeight: 900,
    fontSize: 18,
    cursor: "pointer",
    boxShadow: "0 0 25px rgba(168,85,247,0.4)",
  },

  joinButton: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
    border: "none",
    background: "white",
    color: "black",
    fontWeight: 900,
    fontSize: 18,
    cursor: "pointer",
  },

  message: {
    position: "fixed",
    top: 30,
    right: 30,
    zIndex: 9999,

    padding: "16px 22px",
    borderRadius: 18,

    color: "white",
    fontWeight: 700,

    backdropFilter: "blur(20px)",

    boxShadow: "0 0 25px rgba(0,0,0,0.35)",

    animation: "fadeIn 0.3s ease",
  },

  loadingOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(10px)",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    zIndex: 99999,
  },

  loadingSpinner: {
    width: 70,
    height: 70,

    border: "5px solid rgba(255,255,255,0.1)",
    borderTop: "5px solid #a855f7",

    borderRadius: "50%",

    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 25,
    fontSize: 24,
    fontWeight: 900,

    background: "linear-gradient(90deg,#a855f7,#ff4ecd)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
};
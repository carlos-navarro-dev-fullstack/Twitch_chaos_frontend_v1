import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/gameStore";
import { leaveRoom } from "../services/api";
import { sendVote, disconnectSocket } from "../services/websocket";

export default function RoomPage() {

  const { roomId } = useParams();

  const navigate = useNavigate();

  const username =
    localStorage.getItem("username") || "guest";

  const game = useGameStore((s) => s.game);

  const connected =
    useGameStore((s) => s.connected);

  const resetGame =
    useGameStore((s) => s.resetGame);

  const [selected, setSelected] =
    useState(null);

  useGameSocket(roomId, username);

  // 🚪 SALIR
  function handleLeaveRoom() {

    disconnectSocket();

    resetGame();

    navigate("/");

    leaveRoom(roomId, username)
      .catch(console.error);
  }

  // 🟡 LOADING
  if (!connected) {

    return (
      <div style={styles.loading}>
        <h2>🔌 Conectando al servidor...</h2>
        <div style={styles.spinner} />
      </div>
    );
  }

  // 🎮 NO GAME
  if (!game) {
    return <h1>🎮 Esperando partida...</h1>;
  }

  // 🗳️ VOTO
  function handleVote(option) {

    setSelected(option);

    sendVote(
      roomId,
      username,
      option
    );

    setTimeout(() => {
      setSelected(null);
    }, 180);
  }

  return (

    <div style={styles.container}>

      <div style={styles.backgroundGlow1}></div>
      <div style={styles.backgroundGlow2}></div>

      {/* HEADER */}
      <div style={styles.topBar}>

        <div>
          <h1 style={styles.title}>
            🎭 Sala {roomId}
          </h1>

          <p style={styles.user}>
            👤 {username}
          </p>
        </div>

        <button
          onClick={handleLeaveRoom}
          style={styles.leaveBtn}
        >
          🚪 Salir
        </button>

      </div>

      {/* SITUACIÓN */}
      <div style={styles.card}>

        <p style={styles.round}>
          RONDA {game.round}
        </p>

        <h2 style={styles.situation}>
          {game.situation}
        </h2>

      </div>

      {/* OPCIONES */}
      <div style={styles.optionsWrapper}>

        <h3 style={styles.sectionTitle}>
          💬 A votar!!!
        </h3>

        {game.options?.map((option) => {

          const percent =
            game.votePercentages?.[option] || 0;

          const votes =
            game.voteCounts?.[option] || 0;

          return (

            <button
              key={option}
              onClick={() => handleVote(option)}
              style={{
                ...styles.optionCard,

                border:
                  selected === option
                    ? "2px solid #8b5cf6"
                    : "2px solid transparent",

                transform:
                  selected === option
                    ? "scale(0.98)"
                    : "scale(1)",
              }}
            >

              {/* TEXTO */}
              <div style={styles.optionTop}>

                <span>{option}</span>

                <span style={styles.percent}>
                  {percent}%
                </span>

              </div>

              {/* BARRA */}
              <div style={styles.progressBg}>

                <div
                  style={{
                    ...styles.progressFill,
                    width: `${percent}%`,
                  }}
                />

              </div>

              {/* INFO */}
              <div style={styles.voteCount}>
                🗳️ {votes} votos • 📊 {percent}%
              </div>

            </button>
          );
        })}

      </div>

      {/* ESTADÍSTICAS */}
      <div style={styles.statsGrid}>

        <div style={styles.statCard}>
          <h4>🔥 Reputación</h4>
          <p>{game.reputation}</p>
        </div>

        <div style={styles.statCard}>
          <h4>💀 Funa</h4>
          <p>{game.funa}</p>
        </div>

        <div style={styles.statCard}>
          <h4>👥 Jugadores</h4>
          <p>{game.players}</p>
        </div>

        <div style={styles.statCard}>
          <h4>📊 Estado</h4>
          <p>{game.state}</p>
        </div>

      </div>

      {/* RESULTADOS */}
      {(game.chatChoice || game.streamerChoice) && (

        <div style={styles.resultsWrapper}>

          <h3>
            📢 Resultado de la ronda
          </h3>
          {game.streamerChoice && (
            <div style={styles.result}>
              🎥 Streamer eligió:
              <strong>
                {" "}
                {game.streamerChoice}
              </strong>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

// 🎨 ESTILOS
const styles = {

  container: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #5b21b6 0%, #090909 45%)",
    color: "white",
    padding: "30px 6%",
    fontFamily: "Inter, sans-serif",
    position: "relative",
    overflow: "hidden",
  },

  // 🌌 GLOWS
  backgroundGlow1: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "#7c3aed",
    filter: "blur(140px)",
    opacity: 0.18,
    top: -100,
    left: -100,
    zIndex: 0,
  },

  backgroundGlow2: {
    position: "absolute",
    width: 450,
    height: 450,
    borderRadius: "50%",
    background: "#ec4899",
    filter: "blur(140px)",
    opacity: 0.15,
    bottom: -100,
    right: -100,
    zIndex: 0,
  },

  // 🔝 HEADER
  topBar: {
    position: "relative",
    zIndex: 2,

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 30,

    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",

    padding: 24,
    borderRadius: 24,

    backdropFilter: "blur(20px)",
  },

  title: {
    margin: 0,
    fontSize: 42,
    fontWeight: 900,
    letterSpacing: -1,
  },

  user: {
    opacity: 0.75,
    marginTop: 6,
    fontSize: 15,
  },

  leaveBtn: {
    padding: "14px 22px",

    background:
      "linear-gradient(90deg,#ff3b30,#ff006e)",

    color: "white",

    border: "none",
    borderRadius: 16,

    cursor: "pointer",

    fontWeight: 800,
    fontSize: 15,

    boxShadow: "0 0 25px rgba(255,0,90,0.35)",

    transition: "0.2s",
  },

  // ⏳ LOADING
  loading: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    background:
      "radial-gradient(circle at top left, #5b21b6 0%, #090909 45%)",

    color: "white",
    fontFamily: "Inter, sans-serif",
  },

  spinner: {
    width: 55,
    height: 55,

    marginTop: 25,

    border: "5px solid rgba(255,255,255,0.08)",
    borderTop: "5px solid #a855f7",

    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // 🎭 SITUATION CARD
  card: {
    position: "relative",
    zIndex: 2,

    background: "rgba(15,15,15,0.82)",

    padding: 35,

    borderRadius: 30,

    marginBottom: 30,

    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(24px)",

    boxShadow: "0 0 40px rgba(168,85,247,0.12)",
  },

  round: {
    opacity: 0.65,

    fontSize: 12,

    letterSpacing: 3,

    marginBottom: 14,

    color: "#c084fc",

    fontWeight: 700,
  },

  situation: {
    margin: 0,

    fontSize: 42,

    lineHeight: 1.15,

    fontWeight: 900,
  },

  // 🗳️ OPTIONS
  optionsWrapper: {
    position: "relative",
    zIndex: 2,
    marginBottom: 35,
  },

  sectionTitle: {
    marginBottom: 18,
    fontSize: 24,
    fontWeight: 900,
  },

  optionCard: {
    width: "100%",

    background: "rgba(20,20,20,0.85)",

    color: "white",

    padding: 22,

    borderRadius: 24,

    marginBottom: 18,

    cursor: "pointer",

    transition: "all 0.18s ease",

    backdropFilter: "blur(20px)",

    boxShadow: "0 0 25px rgba(0,0,0,0.3)",
  },

  optionTop: {
    display: "flex",
    justifyContent: "space-between",

    marginBottom: 14,

    fontWeight: 800,

    fontSize: 18,
  },

  percent: {
    color: "#c084fc",
    fontWeight: 900,
  },

  progressBg: {
    width: "100%",
    height: 14,

    background: "#242424",

    borderRadius: 999,

    overflow: "hidden",
  },

  progressFill: {
    height: "100%",

    background:
      "linear-gradient(90deg,#7c3aed,#ec4899)",

    transition: "width 0.35s ease",

    boxShadow: "0 0 18px rgba(168,85,247,0.45)",
  },

  voteCount: {
    marginTop: 14,

    opacity: 0.72,

    fontSize: 14,
  },

  // 📊 STATS
  statsGrid: {
    position: "relative",
    zIndex: 2,

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",

    gap: 18,

    marginBottom: 35,
  },

  statCard: {
    background: "rgba(20,20,20,0.85)",

    padding: 24,

    borderRadius: 24,

    textAlign: "center",

    border: "1px solid rgba(255,255,255,0.06)",

    backdropFilter: "blur(18px)",

    boxShadow: "0 0 25px rgba(0,0,0,0.25)",
  },

  // 📢 RESULT
  resultsWrapper: {
    position: "relative",
    zIndex: 2,

    background: "rgba(15,15,15,0.85)",

    padding: 28,

    borderRadius: 26,

    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(20px)",
  },

  result: {
    marginTop: 16,

    padding: 20,

    background:
      "linear-gradient(90deg,#7c3aed,#ec4899)",

    borderRadius: 18,

    fontWeight: 700,

    fontSize: 18,

    boxShadow: "0 0 25px rgba(168,85,247,0.35)",
  },
};
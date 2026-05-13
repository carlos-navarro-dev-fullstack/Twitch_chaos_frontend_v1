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

  console.log(game)

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
          💬 El chat está votando...
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

          {game.chatChoice && (
            <div style={styles.result}>
              💬 Chat eligió:
              <strong>
                {" "}
                {game.chatChoice}
              </strong>
            </div>
          )}

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
    background: "#0f0f0f",
    color: "white",
    padding: 20,
    fontFamily: "sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    margin: 0,
    fontSize: 32,
  },

  user: {
    opacity: 0.7,
    marginTop: 5,
  },

  leaveBtn: {
    padding: "10px 16px",
    background: "#ff3b30",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: "bold",
  },

  loading: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f0f0f",
    color: "white",
  },

  spinner: {
    width: 40,
    height: 40,
    marginTop: 20,
    border: "4px solid #333",
    borderTop: "4px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  card: {
    background: "#1b1b1b",
    padding: 25,
    borderRadius: 18,
    marginBottom: 25,
    border: "1px solid #2a2a2a",
  },

  round: {
    opacity: 0.6,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 10,
  },

  situation: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.3,
  },

  optionsWrapper: {
    marginBottom: 30,
  },

  sectionTitle: {
    marginBottom: 15,
  },

  optionCard: {
    width: "100%",
    background: "#1b1b1b",
    color: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 15,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  optionTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
    fontWeight: "bold",
  },

  percent: {
    color: "#8b5cf6",
  },

  progressBg: {
    width: "100%",
    height: 10,
    background: "#2c2c2c",
    borderRadius: 999,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#8b5cf6",
    transition: "width 0.3s ease",
  },

  voteCount: {
    marginTop: 10,
    opacity: 0.7,
    fontSize: 14,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 15,
    marginBottom: 30,
  },

  statCard: {
    background: "#1b1b1b",
    padding: 18,
    borderRadius: 16,
    textAlign: "center",
  },

  resultsWrapper: {
    background: "#1b1b1b",
    padding: 20,
    borderRadius: 16,
  },

  result: {
    marginTop: 10,
    padding: 15,
    background: "#6026e8",
    borderRadius: 12,
  },
};
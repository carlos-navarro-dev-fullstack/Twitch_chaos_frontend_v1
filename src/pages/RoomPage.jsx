import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useGameSocket } from "../hooks/useGameSocket";
import { useGameStore } from "../store/gameStore";

import { leaveRoom } from "../services/api";
import { sendVote, disconnectSocket } from "../services/websocket";

import { styles } from "../styles/roomPage.styles";

export default function RoomPage() {

  const { roomId } = useParams();

  const navigate = useNavigate();

  const [roomError, setRoomError] =
    useState(false);

  const [selected, setSelected] =
    useState(null);

  const game =
    useGameStore((s) => s.game);

  const connected =
    useGameStore((s) => s.connected);

  const resetGame =
    useGameStore((s) => s.resetGame);

  const username =
    localStorage.getItem("username") || "guest";

  const isGameOver =
    game?.state === "GAME_OVER";

  useGameSocket(roomId, username);

  useEffect(() => {

    const timer = setTimeout(() => {

      if (!game) {
        setRoomError(true);
      }

    }, 4000);

    return () => clearTimeout(timer);

  }, [game]);

  // 🚪 SALIR
  function handleLeaveRoom() {

    disconnectSocket();

    resetGame();

    navigate("/");

    leaveRoom(roomId, username)
      .catch(console.error);
  }

  // 🗳️ VOTAR
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

  // 🚫 ROOM NO EXISTE
  if (roomError) {

    return (
      <div style={styles.loading}>

        <h1>
          🚫 Sala no encontrada
        </h1>

        <p style={{ opacity: 0.7 }}>
          La sala ya no existe o fue cerrada
        </p>

        <button
          style={styles.leaveBtn}
          onClick={() => navigate("/")}
        >
          Volver
        </button>

      </div>
    );
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

  // 🏁 GAME OVER
  if (isGameOver) {

    const lostByFuna =
      game.funa >= 100;

    const lostByReputation =
      game.reputation <= 0;

    return (

      <div style={styles.endScreen}>

        <h1 style={styles.endTitle}>
          {
            lostByFuna
              ? "💀 EL STREAMER FUE CANCELADO"
              : lostByReputation
                ? "📉 EL STREAMER PERDIÓ TODO EL RESPETO"
                : "🏁 FIN DEL STREAM"
          }
        </h1>

        <p style={styles.endText}>
          Funa: {game.funa} / 100
          <br />
          Reputación: {game.reputation} / 100
        </p>

        <button
          style={styles.endButton}
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>

      </div>
    );
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
          💬 A votar!!! Da tiempo a tu chat a votar
        </h3>

        {game.options?.map((option) => {

          const percent =
            game.votePercentages?.[option.text] || 0;

          const votes =
            game.voteCounts?.[option.text] || 0;

          return (

            <button
              key={option.text}
              onClick={() => handleVote(option.text)}
              style={{
                ...styles.optionCard,

                border:
                  selected === option.text
                    ? "2px solid #8b5cf6"
                    : "2px solid transparent",

                transform:
                  selected === option.text
                    ? "scale(0.98)"
                    : "scale(1)",
              }}
            >

              <div style={styles.optionTop}>

                <span>{option.text}</span>

                <span style={styles.percent}>
                  {percent}%
                </span>

              </div>

              <div style={styles.progressBg}>

                <div
                  style={{
                    ...styles.progressFill,
                    width: `${percent}%`,
                  }}
                />

              </div>

              <div style={styles.voteCount}>
                🗳️ {votes} votos • 📊 {percent}%
              </div>

            </button>
          );
        })}

      </div>

      {/* STATS */}
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
                {game.streamerChoice.text}
              </strong>

            </div>

          )}

        </div>
      )}

    </div>
  );
}
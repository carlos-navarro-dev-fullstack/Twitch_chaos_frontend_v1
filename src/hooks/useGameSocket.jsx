import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/websocket";
import { useGameStore } from "../store/gameStore";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useGameSocket = (roomId, username) => {

  const setGame =
    useGameStore((s) => s.setGame);

  const setConnected =
    useGameStore((s) => s.setConnected);

  useEffect(() => {

    if (!roomId || !username) return;

    let mounted = true;

    async function init() {

      try {
        // 👤 REGISTRAR JUGADOR
        const joinRes = await fetch(
          `${API_URL}/game/join?roomId=${roomId}&username=${username}`,
          {
            method: "POST",
          }
        );
        // 🎮 OBTENER ESTADO INICIAL
        const roomRes = await fetch(
          `${API_URL}/game/room/${roomId}`
        );

        const data = await roomRes.json();
        if (!mounted) return;

        // 🔥 GUARDAR ESTADO
        setGame(data);

        // 🔌 WEBSOCKET
        connectSocket(
          roomId,
          (newState) => {
            setGame(newState);
          },
          username
        );

        setConnected(true);

      } catch (err) {

        console.error(
          "❌ Error loading room:",
          err
        );

        setConnected(false);
      }
    }

    init();

    // 🧹 CLEANUP
    return () => {

      mounted = false;

      disconnectSocket();

      setConnected(false);
    };

  }, [roomId, username]);
};
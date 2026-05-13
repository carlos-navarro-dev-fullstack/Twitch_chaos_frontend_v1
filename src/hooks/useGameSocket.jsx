import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/websocket";
import { useGameStore } from "../store/gameStore";

// 🌍 API BASE DESDE .env
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const useGameSocket = (roomId, username) => {
  const setGame = useGameStore((s) => s.setGame);
  const setConnected = useGameStore((s) => s.setConnected);

  useEffect(() => {
    if (!roomId || !username) return;

    let mounted = true;

    const init = async () => {
      try {
        // 👤 JOIN ROOM
        const joinRes = await fetch(
          `${API_URL}/game/join?roomId=${roomId}&username=${username}`,
          {
            method: "POST",
          }
        );


        // 🎮 GET INITIAL STATE
        const roomRes = await fetch(
          `${API_URL}/game/room/${roomId}`
        );

        const data = await roomRes.json();


        if (!mounted) return;

        // 🔥 SAVE STATE
        setGame(data);

        // 🔌 WEBSOCKET (manejado en websocket service con VITE_WS_URL)
        connectSocket(roomId, setGame);

        setConnected(true);
      } catch (err) {
        console.error("❌ Error loading room:", err);
        setConnected(false);
      }
    };

    init();

    // 🧹 CLEANUP
    return () => {
      mounted = false;
      disconnectSocket();

      setConnected(false);
    };
  }, [roomId, username]);
};
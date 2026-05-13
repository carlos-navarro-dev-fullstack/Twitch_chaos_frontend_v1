import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameStore } from "../store/gameStore";

let client = null;

const setConnected = useGameStore.getState().setConnected;

// 🔥 usa variable de entorno (LOCAL + PROD)
const WS_URL =
  import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

// =====================================================
// CONNECT
// =====================================================
export const connectSocket = (roomId, setGame) => {
  if (client?.connected) return;

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 5000,

    onConnect: () => {

      setConnected(true);

      client.subscribe(`/topic/rooms/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        setGame(data);
      });
    },

    onStompError: (frame) => {
      console.error("❌ STOMP ERROR", frame);
    },

    onWebSocketClose: () => {
      setConnected(false);
    },
  });

  client.activate();
};

// =====================================================
// 🗳️ SEND VOTE
// =====================================================
export const sendVote = (roomId, username, option) => {
  if (!client?.connected) {
    return;
  }

  client.publish({
    destination: "/app/vote",
    body: JSON.stringify({
      roomId,
      username,
      option,
    }),
  });
};

// =====================================================
// STREAMER CHOICE
// =====================================================
export const sendStreamerChoice = (roomId, option) => {
  if (!client?.connected) return;

  client.publish({
    destination: "/app/streamer-choice",
    body: JSON.stringify({
      roomId,
      option,
    }),
  });
};

// =====================================================
// DISCONNECT
// =====================================================
export const disconnectSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
    setConnected(false);
  }
};
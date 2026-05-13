import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameStore } from "../store/gameStore";

let client = null;
let connected = false;

const setConnected = useGameStore.getState().setConnected;

export const connectSocket = (roomId, setGame) => {
  if (client?.connected) return;

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000,

    onConnect: () => {
      console.log("Connected ✔️");

      setConnected(true);

      client.subscribe(`/topic/rooms/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        setGame(data);
      });
    },

    onDisconnect: () => {
      setConnected(false);
    },
  });

  client.activate();
};

// =====================================================
// 🗳️ SEND VOTE
// =====================================================
export const sendVote = (
  roomId,
  username,
  option
) => {

  if (!client) {
    console.log("❌ NO CLIENT");
    return;
  }

  console.log("📤 ENVIANDO VOTO", {
    roomId,
    username,
    option,
  });

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
// DISCONNECT
// =====================================================
export const disconnectSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
    console.log("🔌 Socket desconectado");
  }
};

export const sendStreamerChoice = (roomId, option) => {
  if (!client || !client.connected) return;

  client.publish({
    destination: "/app/streamer-choice",
    body: JSON.stringify({
      roomId,
      option,
    }),
  });
};
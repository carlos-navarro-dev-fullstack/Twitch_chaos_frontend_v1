const API = import.meta.env.VITE_API_URL;

export async function createRoom() {
  const username = localStorage.getItem("username");

  const res = await fetch(
    `${API}/game/create?username=${username}`,
    {
      method: "POST",
    }
  );

  return await res.text();
}

export async function leaveRoom(roomId, username) {
  await fetch(
    `${API}/game/leave?roomId=${roomId}&username=${username}`,
    {
      method: "POST",
    }
  );
}
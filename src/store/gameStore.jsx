import { create } from "zustand";

export const useGameStore = create((set) => ({
  game: null,
  connected: false,

  setGame: (game) =>
    set({
      game,
      connected: true,
    }),

  setConnected: (value) =>
    set({
      connected: value,
    }),

  resetGame: () =>
    set({
      game: null,
      connected: false,
    }),
}));
import { create } from 'zustand';
import { Room, Player, Bet } from '../types/game';

interface GameStore {
  room: Room | null;
  currentPlayer: Player | null;
  setRoom: (room: Room) => void;
  setCurrentPlayer: (player: Player) => void;
  addBet: (bet: Bet) => void;
  setPlayerReady: (playerId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  room: null,
  currentPlayer: null,
  setRoom: (room) => set({ room }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  addBet: (bet) => set((state) => ({
    currentPlayer: state.currentPlayer
      ? {
          ...state.currentPlayer,
          currentBets: [...state.currentPlayer.currentBets, bet],
        }
      : null,
  })),
  setPlayerReady: (playerId) => set((state) => ({
    room: state.room
      ? {
          ...state.room,
          players: state.room.players.map((p) =>
            p.id === playerId ? { ...p, isReady: true } : p
          ),
        }
      : null,
  })),
}));
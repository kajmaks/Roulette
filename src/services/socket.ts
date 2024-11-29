import { io } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';

const SOCKET_URL = 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('roomJoined', (data: { room: any; player: any }) => {
  const { room, player } = data;
  useGameStore.getState().setRoom(room);
  useGameStore.getState().setCurrentPlayer(player);
});

socket.on('roomUpdated', (room: any) => {
  useGameStore.getState().setRoom(room);
});

socket.on('gameStateUpdated', (room: any) => {
  useGameStore.getState().setRoom(room);
});

socket.on('error', (error: { message: string }) => {
  console.error('Socket error:', error.message);
});
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the dist directory
app.use(express.static('dist'));

// Handle all routes for SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', ({ playerName }) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const player = {
      id: socket.id,
      name: playerName,
      balance: 1000,
      isReady: false,
      currentBets: []
    };

    const room = {
      id: roomId,
      players: [player],
      gameState: 'waiting',
      currentNumber: null,
      bettingOpen: true
    };

    rooms.set(roomId, room);
    socket.join(roomId);

    socket.emit('roomJoined', { room, player });
    socket.emit('roomCreated', { roomId });
  });

  socket.on('joinRoom', ({ roomCode, playerName }) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const player = {
      id: socket.id,
      name: playerName,
      balance: 1000,
      isReady: false,
      currentBets: []
    };

    room.players.push(player);
    socket.join(roomCode);

    socket.emit('roomJoined', { room, player });
    io.to(roomCode).emit('roomUpdated', room);
  });

  socket.on('playerReady', ({ roomId, playerId }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    const player = room.players.find(p => p.id === playerId);
    if (player) {
      player.isReady = true;
    }

    const allReady = room.players.every(p => p.isReady);
    if (allReady && room.players.length >= 2) {
      room.gameState = 'spinning';
      // Start the game logic here
      startGameRound(roomId);
    }

    io.to(roomId).emit('roomUpdated', room);
  });

  socket.on('disconnect', () => {
    rooms.forEach((room, roomId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('roomUpdated', room);
        }
      }
    });
  });
});

function startGameRound(roomId) {
  const room = rooms.get(roomId);
  if (!room) return;

  // Close betting
  room.bettingOpen = false;
  io.to(roomId).emit('roomUpdated', room);

  // Simulate wheel spinning
  setTimeout(() => {
    const winningNumber = Math.floor(Math.random() * 37); // 0-36
    room.currentNumber = winningNumber;
    room.gameState = 'paying';

    // Calculate winnings
    room.players.forEach(player => {
      player.currentBets.forEach(bet => {
        const winAmount = calculateWinAmount(bet, winningNumber);
        if (winAmount > 0) {
          player.balance += winAmount;
        }
      });
      player.currentBets = [];
      player.isReady = false;
    });

    room.gameState = 'waiting';
    room.bettingOpen = true;
    io.to(roomId).emit('roomUpdated', room);
  }, 5000); // 5 seconds for animation
}

function calculateWinAmount(bet, winningNumber) {
  // Implement winning calculations based on bet type
  switch (bet.type) {
    case 'straight':
      return bet.numbers.includes(winningNumber) ? bet.amount * 35 : 0;
    case 'split':
      return bet.numbers.includes(winningNumber) ? bet.amount * 17 : 0;
    case 'street':
      return bet.numbers.includes(winningNumber) ? bet.amount * 11 : 0;
    case 'corner':
      return bet.numbers.includes(winningNumber) ? bet.amount * 8 : 0;
    case 'line':
      return bet.numbers.includes(winningNumber) ? bet.amount * 5 : 0;
    case 'dozen':
    case 'column':
      return bet.numbers.includes(winningNumber) ? bet.amount * 2 : 0;
    case 'red':
    case 'black':
    case 'even':
    case 'odd':
    case 'low':
    case 'high':
      return bet.numbers.includes(winningNumber) ? bet.amount : 0;
    default:
      return 0;
  }
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../services/socket';
import { RouletteWheel } from './RouletteWheel';
import { BettingTable } from './BettingTable';
import { useGameStore } from '../store/gameStore';
import { Users, Timer, DollarSign } from 'lucide-react';

export const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { room, currentPlayer, setPlayerReady } = useGameStore();

  useEffect(() => {
    if (roomId) {
      socket.emit('joinRoom', roomId);
    }

    return () => {
      socket.emit('leaveRoom', roomId);
    };
  }, [roomId]);

  const readyUp = () => {
    if (currentPlayer) {
      socket.emit('playerReady', { roomId, playerId: currentPlayer.id });
      setPlayerReady(currentPlayer.id);
    }
  };

  if (!room || !currentPlayer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Users className="w-6 h-6" />
            <span>Room: {roomId}</span>
            <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
              {room.players.length} Players
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <DollarSign className="w-6 h-6" />
            <span className="text-xl font-bold">${currentPlayer.balance}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RouletteWheel />
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Players</h2>
              <div className="space-y-2">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between bg-gray-700 p-3 rounded"
                  >
                    <span>{player.name}</span>
                    <div className="flex items-center space-x-3">
                      <span>${player.balance}</span>
                      {player.isReady && (
                        <span className="bg-green-500 px-2 py-1 rounded text-sm">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <BettingTable />
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Timer className="w-5 h-5" />
                <span>Betting Phase</span>
              </div>
              
              <button
                onClick={readyUp}
                disabled={currentPlayer.isReady}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  currentPlayer.isReady
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Ready Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
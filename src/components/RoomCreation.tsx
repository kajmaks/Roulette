import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DiceIcon, WifiOff } from 'lucide-react';
import { socket } from '../services/socket';

export const RoomCreation: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const navigate = useNavigate();

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setError('');
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setError('Server connection lost. Please wait...');
    };

    const onConnectError = () => {
      setIsConnected(false);
      setError('Cannot connect to server. Please try again later.');
    };

    const onRoomCreated = ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('roomCreated', onRoomCreated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('roomCreated', onRoomCreated);
    };
  }, [navigate]);

  const createRoom = () => {
    if (!isConnected) {
      setError('Please wait for server connection');
      return;
    }
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    socket.emit('createRoom', { playerName });
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setError('Please wait for server connection');
      return;
    }
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    socket.emit('joinRoom', { roomCode: roomCode.toUpperCase(), playerName });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <DiceIcon className="w-12 h-12 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900 ml-3">Roulette Royale</h1>
        </div>

        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
            <WifiOff className="w-5 h-5 mr-2" />
            Connecting to server...
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              maxLength={20}
            />
          </div>

          <button
            onClick={createRoom}
            disabled={!isConnected}
            className={`w-full ${
              isConnected
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white py-3 px-6 rounded-lg font-semibold transition duration-200`}
          >
            Create New Room
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or join existing</span>
            </div>
          </div>

          <form onSubmit={joinRoom} className="space-y-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter Room Code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={!isConnected}
              className={`w-full ${
                isConnected
                  ? 'bg-gray-800 hover:bg-gray-900'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white py-3 px-6 rounded-lg font-semibold transition duration-200`}
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
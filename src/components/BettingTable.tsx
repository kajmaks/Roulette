import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BetType } from '../types/game';

export const BettingTable: React.FC = () => {
  const { currentPlayer, addBet } = useGameStore();

  const placeBet = (type: BetType, numbers: number[], amount: number = 10) => {
    if (!currentPlayer || !currentPlayer.balance || currentPlayer.balance < amount) return;
    addBet({ type, numbers, amount });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-green-800 p-4 rounded-lg">
      <div className="grid grid-cols-13 gap-1">
        {/* Zero */}
        <button
          onClick={() => placeBet('straight', [0])}
          className="col-span-1 row-span-3 bg-green-600 text-white h-24 rounded hover:bg-green-500 disabled:opacity-50"
          disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
        >
          0
        </button>

        {/* Numbers 1-36 */}
        <div className="col-span-12 grid grid-cols-12 gap-1">
          {[...Array(36)].map((_, i) => {
            const number = i + 1;
            const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);
            
            return (
              <button
                key={number}
                onClick={() => placeBet('straight', [number])}
                className={`h-8 ${
                  isRed ? 'bg-red-600' : 'bg-black'
                } text-white rounded hover:opacity-80 disabled:opacity-50`}
                disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
              >
                {number}
              </button>
            );
          })}
        </div>

        {/* Outside bets */}
        <div className="col-span-13 grid grid-cols-6 gap-1 mt-2">
          <button
            onClick={() => placeBet('dozen', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            1st 12
          </button>
          <button
            onClick={() => placeBet('dozen', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24])}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            2nd 12
          </button>
          <button
            onClick={() => placeBet('dozen', [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36])}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            3rd 12
          </button>
          <button
            onClick={() => placeBet('low', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            1-18
          </button>
          <button
            onClick={() => placeBet('even', Array.from({ length: 18 }, (_, i) => (i + 1) * 2))}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            EVEN
          </button>
          <button
            onClick={() => placeBet('red', [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36])}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-500 disabled:opacity-50"
            disabled={!currentPlayer?.balance || currentPlayer.balance < 10}
          >
            RED
          </button>
        </div>
      </div>
    </div>
  );
};
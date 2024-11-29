import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const NUMBERS = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];

export const RouletteWheel: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { room } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      NUMBERS.forEach((number, index) => {
        const startAngle = (index * 2 * Math.PI) / NUMBERS.length;
        const endAngle = ((index + 1) * 2 * Math.PI) / NUMBERS.length;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        ctx.fillStyle = number === 0 ? '#008000' :
          [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
            .includes(number) ? '#FF0000' : '#000000';
        
        ctx.fill();
        ctx.stroke();
        
        // Draw numbers
        ctx.save();
        ctx.translate(
          centerX + (radius * 0.85) * Math.cos(startAngle + Math.PI / NUMBERS.length),
          centerY + (radius * 0.85) * Math.sin(startAngle + Math.PI / NUMBERS.length)
        );
        ctx.rotate(startAngle + Math.PI / NUMBERS.length + Math.PI / 2);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(number.toString(), 0, 0);
        
        ctx.restore();
      });
    };

    drawWheel();
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="mx-auto"
      />
    </div>
  );
};
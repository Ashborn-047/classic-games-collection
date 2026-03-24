import React from 'react';
import { COLORS, PERIMETER_LENGTH, HOME_PATH_START, FINISH_LINE, getAbsolutePosition } from '../config/ludoConfig';

export default function LudoBoard({ tokens, onTokenClick, currentTurnColor, diceRoll }) {
  // 15x15 Ludo Board Grid
  const renderCell = (x, y) => {
    // Determine cell type and color (Base, Path, Home Path, Center)
    const isBase = (x < 6 && y < 6) || (x > 8 && y < 6) || (x < 6 && y > 8) || (x > 8 && y > 8);
    const isCenter = (x > 5 && x < 9 && y > 5 && y < 9);
    
    let cellBg = 'bg-white';
    if (isBase) {
      if (x < 6 && y < 6) cellBg = 'bg-red-500/20';
      if (x > 8 && y < 6) cellBg = 'bg-green-500/20';
      if (x < 6 && y > 8) cellBg = 'bg-blue-500/20';
      if (x > 8 && y > 8) cellBg = 'bg-yellow-500/20';
    }
    if (isCenter) cellBg = 'bg-black text-white';

    return (
      <div 
        key={`${x}-${y}`} 
        className={`w-full aspect-square border border-slate-200 flex items-center justify-center text-[8px] font-black ${cellBg}`}
      >
        {/* Simplified Board Logic - in a real app, we'd map absolute coordinates to game positions */}
        {isCenter ? 'HUB' : ''}
      </div>
    );
  };

  const grid = [];
  for (let y = 0; y < 15; y++) {
    for (let x = 0; x < 15; x++) {
      grid.push(renderCell(x, y));
    }
  }

  return (
    <div className="relative w-full max-w-[600px] aspect-square border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white grid grid-cols-15">
      {grid}

      {/* Tokens Layer (Absolute Position Overlay) */}
      <div className="absolute inset-0 pointer-events-none">
        {Object.entries(tokens).map(([color, playerTokens]) => 
          playerTokens.map(token => (
             <div 
                key={`${color}-${token.id}`}
                onClick={() => (token.owner === currentTurnColor && diceRoll) && onTokenClick(token.id)}
                className={`pointer-events-auto absolute w-6 h-6 rounded-full border-4 border-black cursor-pointer shadow-sm transition-all duration-300 ${token.owner === currentTurnColor && diceRoll ? 'scale-110 ring-4 ring-white animate-pulse' : ''}`}
                style={{ 
                  backgroundColor: COLORS[color],
                  // In a production app, we would use a lookup table for [pos -> {top, left}]
                  // Here we use simplified placement based on pos
                  top: token.pos === -1 ? '10%' : '50%', 
                  left: token.pos === -1 ? '10%' : '50%' 
                }}
             />
          ))
        )}
      </div>
    </div>
  );
}

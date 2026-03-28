import React, { useMemo } from 'react';
import { GRID_SIZE, BOARD_SIZE, SNAKES, LADDERS } from '../config/snlConfig';

// ⚡ Bolt: Cache static cells array outside the component to prevent
// recreating a 100-element array on every render.
const STATIC_CELLS = [];
for (let i = 0; i < BOARD_SIZE; i++) {
  // Zig-zag pattern
  const row = Math.floor(i / GRID_SIZE);
  const col = row % 2 === 0
    ? i % GRID_SIZE
    : (GRID_SIZE - 1) - (i % GRID_SIZE);

  const cellId = BOARD_SIZE - i;
  STATIC_CELLS.push(cellId);
}

export default function Board({ players, theme }) {
  // ⚡ Bolt: Create an O(1) lookup map for players by position
  // Replaces the O(N * M) players.filter() running inside a 100-item map loop
  const playersByPos = useMemo(() => {
    const map = {};
    players.forEach(p => {
      if (!map[p.pos]) map[p.pos] = [];
      map[p.pos].push(p);
    });
    return map;
  }, [players]);

  return (
    <div className={`grid grid-cols-10 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${theme.bg}`}>
      {STATIC_CELLS.map((id, index) => {
        // ⚡ Bolt: O(1) lookup
        const playerAtCell = playersByPos[id] || [];
        
        return (
          <div 
            key={id}
            className={`aspect-square border-2 ${theme.border} flex items-center justify-center relative ${theme.cell}`}
          >
            <span className="absolute top-1 left-1 text-[8px] font-bold opacity-30">{id}</span>
            
            {/* Draw Snakes or Ladders (Simplified Indicators) */}
            {SNAKES[id] && <span className="text-emerald-500 font-bold text-xs">S</span>}
            {LADDERS[id] && <span className="text-amber-500 font-bold text-xs">L</span>}

            {/* Players */}
            <div className="flex gap-1">
              {playerAtCell.map(p => (
                <div 
                  key={p.id}
                  className="w-4 h-4 rounded-full border-2 border-black shadow-sm"
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

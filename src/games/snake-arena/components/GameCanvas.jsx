import React, { useMemo } from 'react';
import { GRID_SIZE, CELL_SIZE, FOOD_TYPES, PLAYER_COLORS } from '../config/gameConfig';

export default function GameCanvas({ snake1, snake2, food, activeEffects }) {
  const canvasSize = GRID_SIZE * CELL_SIZE;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i <= GRID_SIZE; i++) {
      lines.push(
        <line key={`v-${i}`} x1={i * CELL_SIZE} y1={0} x2={i * CELL_SIZE} y2={canvasSize}
          stroke="#333" strokeWidth="1" opacity="0.15" />,
        <line key={`h-${i}`} x1={0} y1={i * CELL_SIZE} x2={canvasSize} y2={i * CELL_SIZE}
          stroke="#333" strokeWidth="1" opacity="0.15" />
      );
    }
    return lines;
  }, [canvasSize]);

  const renderSnake = (segments, color, playerKey) => {
    const hasShield = activeEffects?.[playerKey] === 'shield';
    return segments.map((seg, i) => {
      const isHead = i === 0;
      return (
        <rect
          key={`${playerKey}-${i}`}
          x={seg.x * CELL_SIZE + 1}
          y={seg.y * CELL_SIZE + 1}
          width={CELL_SIZE - 2}
          height={CELL_SIZE - 2}
          fill={isHead ? '#fff' : color}
          stroke={isHead ? color : '#000'}
          strokeWidth={isHead ? 3 : 2}
          rx={isHead ? 4 : 2}
          style={{
            filter: hasShield && isHead ? `drop-shadow(0 0 6px ${color})` : 'none',
          }}
        />
      );
    });
  };

  return (
    <div className="relative border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[#0a0a0a] overflow-hidden w-full max-w-[500px] aspect-square">
      <svg
        viewBox={`0 0 ${canvasSize} ${canvasSize}`}
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
      >
        {gridLines}

        {/* Food */}
        {food && (
          <g>
            <rect
              x={food.x * CELL_SIZE + 2} y={food.y * CELL_SIZE + 2}
              width={CELL_SIZE - 4} height={CELL_SIZE - 4}
              fill="#fbbf24" stroke="#000" strokeWidth="2" rx="4"
              className="animate-pulse"
            />
            <text
              x={food.x * CELL_SIZE + CELL_SIZE / 2}
              y={food.y * CELL_SIZE + CELL_SIZE / 2 + 1}
              textAnchor="middle" dominantBaseline="central"
              fontSize="16"
            >
              {FOOD_TYPES[food.type]?.emoji || '🍎'}
            </text>
          </g>
        )}

        {/* Snakes */}
        {snake1.length > 0 && renderSnake(snake1, PLAYER_COLORS.p1, 'p1')}
        {snake2.length > 0 && renderSnake(snake2, PLAYER_COLORS.p2, 'p2')}
      </svg>
    </div>
  );
}

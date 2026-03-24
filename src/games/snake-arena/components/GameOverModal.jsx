import React from 'react';
import { Trophy, Skull, RotateCcw, Home } from 'lucide-react';
import { PLAYER_COLORS } from '../config/gameConfig';

export default function GameOverModal({ winner, score1, score2, mode, onRestart, onExit }) {
  const isDraw = winner === 'draw';
  const isSoloOver = winner === 'gameover';
  const winnerLabel = isDraw ? 'DRAW' : isSoloOver ? 'GAME OVER' : winner === 'p1' ? 'PLAYER 1' : (mode === 'ai' ? 'AI' : 'PLAYER 2');
  const winnerColor = isDraw || isSoloOver ? '#fbbf24' : winner === 'p1' ? PLAYER_COLORS.p1 : PLAYER_COLORS.p2;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6 font-mono">
      <div className="bg-white border-8 border-black p-8 md:p-12 max-w-md w-full text-center shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-6">
          {isDraw ? (
            <Skull size={64} className="mx-auto mb-4 text-gray-600" />
          ) : (
            <Trophy size={64} className="mx-auto mb-4" style={{ color: winnerColor }} />
          )}
        </div>

        <h2 className="text-5xl font-black uppercase mb-2" style={{ color: winnerColor }}>
          {winnerLabel}
        </h2>
        <p className="text-xl font-bold uppercase mb-6 text-gray-500">
          {isDraw ? 'Both Snakes Crashed!' : isSoloOver ? 'Try Again for a high score!' : 'Wins the Arena!'}
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <div className="bg-red-100 border-4 border-black px-6 py-3">
            <div className="text-[10px] font-bold text-gray-500">P1</div>
            <div className="text-2xl font-black">{score1}</div>
          </div>
          {mode !== 'solo' && (
            <div className="bg-blue-100 border-4 border-black px-6 py-3">
              <div className="text-[10px] font-bold text-gray-500">{mode === 'ai' ? 'AI' : 'P2'}</div>
              <div className="text-2xl font-black">{score2}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="w-full bg-[#ff2a2a] text-white font-black uppercase text-xl py-4 border-4 border-black shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
            <RotateCcw size={20} /> Play Again
          </button>
          <button onClick={onExit} className="w-full bg-white border-4 border-black font-black uppercase text-lg py-3 shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2">
            <Home size={18} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

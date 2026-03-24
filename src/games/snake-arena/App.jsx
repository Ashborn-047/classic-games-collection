import React, { useState, useEffect, useCallback } from 'react';
import { User, Users, Bot } from 'lucide-react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useSnakeAI } from './hooks/useSnakeAI';
import { AI_LEVELS } from './config/gameConfig';
import GameCanvas from './components/GameCanvas';
import ScoreHUD from './components/ScoreHUD';
import GameOverModal from './components/GameOverModal';

// ==========================================
// LANDING / MODE SELECT
// ==========================================
function LandingPage({ onSelectMode }) {
  const [aiLevel, setAiLevel] = useState('smart');

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex items-center justify-center p-4 font-mono">
      <div className="max-w-2xl w-full bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 text-center">
        <div className="bg-black text-white p-4 mb-8 -rotate-1 shadow-[8px_8px_0px_0px_#ff2a2a]">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Snake Arena</h1>
          <p className="text-sm font-bold text-gray-400 uppercase mt-2">Eat. Grow. Survive.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => onSelectMode('solo', null)}
            className="flex flex-col items-center gap-3 p-6 border-4 border-black bg-yellow-300 hover:bg-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <User size={40} strokeWidth={3} />
            <h3 className="text-xl font-black uppercase">Solo</h3>
            <p className="text-[10px] font-bold text-gray-700 uppercase">Chase Your High Score</p>
          </button>

          <div className="flex flex-col border-4 border-black bg-red-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <button
              onClick={() => onSelectMode('ai', aiLevel)}
              className="flex flex-col items-center gap-3 p-6 flex-1 hover:bg-red-500 active:translate-y-0.5 transition-all text-white"
            >
              <Bot size={40} strokeWidth={3} />
              <h3 className="text-xl font-black uppercase">VS AI</h3>
            </button>
            <div className="flex border-t-4 border-black">
              {Object.entries(AI_LEVELS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setAiLevel(key)}
                  className={`flex-1 py-2 text-[10px] font-black uppercase border-r-2 border-black last:border-r-0 transition-all ${aiLevel === key ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                >
                  {val.name}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSelectMode('pvp', null)}
            className="flex flex-col items-center gap-3 p-6 border-4 border-black bg-cyan-400 hover:bg-cyan-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Users size={40} strokeWidth={3} />
            <h3 className="text-xl font-black uppercase">Local PVP</h3>
            <p className="text-[10px] font-bold text-gray-700 uppercase">Same Keyboard</p>
          </button>
        </div>

        <div className="border-t-4 border-black pt-6">
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase">
            <span>🍎 Eat Food</span>
            <span>⭐ Bonus Points</span>
            <span>🛡️ Shield</span>
            <span>⚡ Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// GAME VIEW
// ==========================================
function GameView({ mode, aiLevel, onExit }) {
  const engine = useSnakeGame(mode, 'normal');
  
  // AI hook (only active when mode is 'ai')
  useSnakeAI(
    mode === 'ai' ? aiLevel : null,
    engine.snake2, engine.snake1, engine.food,
    engine.dir2, engine.setDir2, engine.gameState
  );

  // Start game on mount
  useEffect(() => {
    engine.startGame();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (engine.gameState !== 'playing') return;

      // Player 1: WASD + Arrows
      const keyMap1 = {
        'ArrowUp': 'UP', 'ArrowDown': 'DOWN', 'ArrowLeft': 'LEFT', 'ArrowRight': 'RIGHT',
        'w': 'UP', 's': 'DOWN', 'a': 'LEFT', 'd': 'RIGHT',
        'W': 'UP', 'S': 'DOWN', 'A': 'LEFT', 'D': 'RIGHT',
      };
      if (keyMap1[e.key]) {
        e.preventDefault();
        engine.changeDirection(1, keyMap1[e.key]);
      }

      // Player 2: IJKL (only in PvP mode)
      if (mode === 'pvp') {
        const keyMap2 = {
          'i': 'UP', 'k': 'DOWN', 'j': 'LEFT', 'l': 'RIGHT',
          'I': 'UP', 'K': 'DOWN', 'J': 'LEFT', 'L': 'RIGHT',
        };
        if (keyMap2[e.key]) {
          e.preventDefault();
          engine.changeDirection(2, keyMap2[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [engine.gameState, mode, engine.changeDirection]);

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-black font-mono p-4 flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-start">
      <div className="w-full max-w-[500px] lg:w-72 order-2 lg:order-1">
        <ScoreHUD
          score1={engine.score1} score2={engine.score2}
          snake1={engine.snake1} snake2={engine.snake2}
          activeEffects={engine.activeEffects}
          logs={engine.logs} mode={mode}
          winner={engine.winner} gameState={engine.gameState}
          onRestart={engine.startGame} onExit={onExit}
        />
      </div>

      <div className="w-full max-w-[500px] order-1 lg:order-2 flex justify-center">
        <GameCanvas
          snake1={engine.snake1} snake2={engine.snake2}
          food={engine.food} activeEffects={engine.activeEffects}
        />
      </div>

      {engine.gameState === 'gameover' && (
        <GameOverModal
          winner={engine.winner}
          score1={engine.score1} score2={engine.score2}
          mode={mode}
          onRestart={engine.startGame}
          onExit={onExit}
        />
      )}
    </div>
  );
}

// ==========================================
// APP ROOT
// ==========================================
export default function App() {
  const [view, setView] = useState('landing');
  const [mode, setMode] = useState('solo');
  const [aiLevel, setAiLevel] = useState('smart');

  const handleSelectMode = (selectedMode, selectedAiLevel) => {
    setMode(selectedMode);
    if (selectedAiLevel) setAiLevel(selectedAiLevel);
    setView('game');
  };

  if (view === 'landing') {
    return <LandingPage onSelectMode={handleSelectMode} />;
  }

  return (
    <GameView
      mode={mode}
      aiLevel={aiLevel}
      onExit={() => setView('landing')}
    />
  );
}

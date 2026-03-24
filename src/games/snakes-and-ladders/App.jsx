import React, { useState } from 'react';
import { useSnlLocal } from './hooks/useSnlLocal';
import { THEMES } from './config/snlConfig';
import Board from './components/Board';
import Dice from './components/Dice';
import { ChevronLeft, Info, Activity } from 'lucide-react';

export default function SnlApp({ onExit }) {
  const [themeKey, setThemeKey] = useState('classic');
  const theme = THEMES[themeKey];
  const engine = useSnlLocal();

  return (
    <div className={`min-h-screen ${theme.bg} p-8 font-mono text-black transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start justify-center">
        
        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white border-8 border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Snakes & Ladders</h1>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {Object.keys(THEMES).map(k => (
                <button 
                  key={k}
                  onClick={() => setThemeKey(k)}
                  className={`px-3 py-1 text-[10px] font-black uppercase border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${themeKey === k ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                >
                  {THEMES[k].name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Dice value={engine.lastRoll} isRolling={engine.isRolling} theme={theme} />
              
              <button 
                onClick={engine.rollDice}
                disabled={engine.isRolling || engine.winner}
                className="w-full bg-black text-white py-4 border-4 border-black font-black uppercase text-xl shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
              >
                Roll !
              </button>
            </div>
          </div>

          <div className="bg-white border-8 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xs font-black uppercase text-gray-400 mb-3 flex items-center gap-1">
              <Activity size={12} /> Log
            </h3>
            <div className="space-y-2 h-32 overflow-y-auto">
              {engine.logs.map(log => (
                <div key={log.id} className="text-[10px] font-bold border-b border-gray-100 pb-1">
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board View */}
        <div className="flex-1 max-w-[600px] w-full">
           <Board players={engine.players} theme={theme} />
        </div>
      </div>

      {/* Game Over */}
      {engine.winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[10000]">
          <div className="bg-white border-8 border-black p-12 text-center shadow-[20px_20px_0px_0px_rgba(255,255,255,1)]">
            <h2 className="text-6xl font-black uppercase mb-4">Victory!</h2>
            <p className="text-2xl font-bold uppercase mb-8">{engine.winner.name} Reached the Top!</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-4 bg-black text-white font-black uppercase text-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

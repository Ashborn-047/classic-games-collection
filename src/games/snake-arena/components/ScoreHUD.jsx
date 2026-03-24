import React from 'react';
import { Trophy, Skull, RotateCcw, LogOut, Activity, Shield } from 'lucide-react';

export default function ScoreHUD({ score1, score2, snake1, snake2, activeEffects, logs, mode, winner, gameState, onRestart, onExit }) {
  return (
    <div className="w-full flex flex-col gap-3 font-mono">
      {/* Title */}
      <div className="bg-black text-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_#ff2a2a]">
        <h1 className="text-2xl font-black uppercase tracking-tight">Snake Arena</h1>
        <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">
          {mode === 'solo' ? 'Solo Mode' : mode === 'ai' ? 'VS AI' : 'PVP Match'}
        </p>
      </div>

      {/* Players */}
      <div className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row lg:flex-col gap-2">
        <div className={`flex items-center justify-between p-2 border-2 border-black flex-1 ${gameState === 'playing' ? 'bg-red-100' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff2a2a] border-2 border-black"></div>
            <span className="font-black text-xs uppercase">P1</span>
          </div>
          <div className="flex items-center gap-2">
            {activeEffects.p1 === 'shield' && <Shield size={12} className="text-blue-500" />}
            <span className="font-black text-base">{score1}</span>
          </div>
        </div>

        {(mode === 'ai' || mode === 'pvp') && (
          <div className={`flex items-center justify-between p-2 border-2 border-black flex-1 ${gameState === 'playing' ? 'bg-blue-100' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#2a5aff] border-2 border-black"></div>
              <span className="font-black text-xs uppercase">{mode === 'ai' ? 'AI' : 'P2'}</span>
            </div>
            <div className="flex items-center gap-2">
              {activeEffects.p2 === 'shield' && <Shield size={12} className="text-blue-500" />}
              <span className="font-black text-base">{score2}</span>
            </div>
          </div>
        )}
      </div>

      {/* Info Stats (Length etc) */}
      <div className="bg-white border-4 border-black p-2 shadow-[2px_2px_0px_0px_#000] flex justify-between px-4">
        <div className="text-[10px] font-bold text-gray-500 uppercase">
          P1 Len: {snake1.length}
        </div>
        {snake2.length > 0 && (
          <div className="text-[10px] font-bold text-gray-500 uppercase">
            P2 Len: {snake2.length}
          </div>
        )}
      </div>

      {/* Activity Log */}
      <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] hidden sm:block">
        <h3 className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Activity size={12} /> Activity Log</h3>
        <div className="flex flex-col gap-1 text-[10px] font-bold h-24 overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="p-1 border border-gray-100 text-gray-600">{log.text}</div>
          ))}
        </div>
      </div>

      {/* Controls & Actions */}
      <div className="flex flex-col gap-2">
        {gameState === 'playing' && (
          <div className="bg-yellow-300 border-4 border-black p-2 shadow-[4px_4px_0px_0px_#000] text-center">
            <p className="text-[10px] font-black uppercase">WASD / Arrows</p>
            {mode === 'pvp' && <p className="text-[10px] font-bold text-gray-600">P2: IJKL</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={onRestart} className="bg-[#ff2a2a] text-white border-4 border-black py-2 font-black uppercase shadow-[4px_4px_0px_0px_#000] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 text-xs">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={onExit} className="bg-white border-4 border-black py-2 font-black text-xs uppercase shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>
    </div>
  );
}

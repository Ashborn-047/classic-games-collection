import React from 'react';
import { useLudoGame } from './hooks/useLudoGame';
import { PLAYERS, COLORS } from './config/ludoConfig';
import LudoBoard from './components/LudoBoard';
import { RotateCcw, Activity, Dices, Trophy } from 'lucide-react';

export default function LudoApp({ onExit }) {
  const engine = useLudoGame();
  const currentTurn = PLAYERS[engine.turnIndex];

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-4 md:p-8 font-mono text-black">
      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8 items-start justify-center">
        
        {/* Left Stats & Controls */}
        <div className="w-full xl:w-80 flex flex-col gap-4 order-2 xl:order-1">
          <div className="bg-black text-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_#ff2a2a]">
            <h1 className="text-2xl font-black uppercase">Ludo Modern</h1>
            <p className="text-[10px] text-gray-400 font-bold opacity-80 uppercase tracking-widest mt-1">SpacetimeDB Logic</p>
          </div>

          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
             <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase">Turn</span>
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 rounded-full border-2 border-black" style={{ backgroundColor: COLORS[currentTurn] }} />
                   <span className="font-black uppercase">{currentTurn}</span>
                </div>
             </div>

             <div className="bg-gray-100 border-4 border-black p-6 flex flex-col items-center gap-2 mb-4">
                <div className={`text-4xl font-black ${engine.isRolling ? 'animate-bounce' : ''}`}>
                   {engine.diceRoll || <Dices size={40} className="opacity-20" />}
                </div>
                <button 
                  onClick={engine.rollDice}
                  disabled={engine.diceRoll !== null || engine.isRolling || engine.winner}
                  className="w-full bg-blue-500 text-white font-black uppercase py-2 border-2 border-black shadow-[3px_3px_0px_0px_#000] active:translate-y-1 active:shadow-none disabled:opacity-50"
                >
                  Roll Dice
                </button>
             </div>

             <div className="space-y-1">
                <h3 className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 mb-2">
                   <Activity size={12} /> Log
                </h3>
                {engine.logs.map(log => (
                  <div key={log.id} className="text-[10px] font-bold border-b border-gray-100 py-1">
                    {log.text}
                  </div>
                ))}
             </div>
          </div>

          <button onClick={() => window.location.reload()} className="bg-white border-4 border-black py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_#000] flex items-center justify-center gap-2">
            <RotateCcw size={16} /> Reset Match
          </button>
        </div>

        {/* Center Board */}
        <div className="flex-1 w-full max-w-[600px] order-1 xl:order-2">
           <LudoBoard 
              tokens={engine.tokens} 
              onTokenClick={(tokenId) => engine.moveToken(currentTurn, tokenId, engine.diceRoll)}
              currentTurnColor={currentTurn}
              diceRoll={engine.diceRoll}
           />
        </div>

        {/* Right Info Hidden on Mobile */}
        <div className="hidden 2xl:block w-64 bg-yellow-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] order-3">
           <h3 className="text-sm font-black uppercase mb-4">Rules</h3>
           <ul className="text-[10px] font-bold space-y-2">
              <li>• Need a 6 to start from base</li>
              <li>• Roll 6 for extra turn</li>
              <li>• Capture enemies to send them back</li>
              <li>• Safe spots indicated by stars</li>
           </ul>
        </div>
      </div>

      {/* Winner Modal */}
      {engine.winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] p-6">
           <div className="bg-white border-8 border-black p-12 text-center shadow-[16px_16px_0px_0px_#fbbf24]">
              <Trophy size={80} className="mx-auto text-yellow-500 mb-6 drop-shadow-[4px_4px_0px_#000]" />
              <h2 className="text-5xl font-black uppercase mb-2">{engine.winner} Wins!</h2>
              <p className="text-xl font-bold uppercase mb-8 text-gray-500">Ultimate Strategy Master</p>
              <button onClick={() => window.location.reload()} className="px-12 py-4 bg-black text-white font-black uppercase text-2xl border-4 border-black">Play Again</button>
           </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { 
  Dices, Trophy, AlertTriangle, RefreshCcw, User, 
  Map, Users, PlusCircle, LogIn, ChevronLeft 
} from 'lucide-react';
import './index.css';
import { useLudoEngine } from './engine';

// --- CONSTANTS (ORIGINAL SOURCE) ---
const PLAYERS = ['RED', 'GREEN', 'YELLOW', 'BLUE'];
const COLORS = { RED: '#FF3366', GREEN: '#00FF66', YELLOW: '#FFCC00', BLUE: '#33CCFF' };
const START_POS = { RED: 0, GREEN: 13, YELLOW: 26, BLUE: 39 };

const PATH_COORDS = [
  [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [6, 6], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 9], [7, 10], [7, 11], [7, 12], [7, 13], [7, 14],
  [8, 14], [9, 14], [9, 13], [9, 12], [9, 11], [9, 10], [9, 9], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 5], [9, 4], [9, 3], [9, 2], [9, 1], [9, 0], [8, 0]
];

const HOME_PATHS = {
  RED: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  GREEN: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  YELLOW: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  BLUE: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]]
};

// --- CORE UI COMPONENTS ---
const Token = ({ color, index, position, isActive, onClick }) => {
  const [row, col] = useMemo(() => {
    if (position === -1) return [0, 0]; // Base is handled by HomeBase
    if (position >= 52) return HOME_PATHS[color][position - 52];
    return PATH_COORDS[position];
  }, [position, color]);

  if (position === -1) return null;

  return (
    <div 
        onClick={onClick}
        className={`ludo-token ${isActive ? 'active' : ''}`}
        style={{ 
            gridRow: row + 1, 
            gridColumn: col + 1, 
            backgroundColor: COLORS[color],
            borderColor: 'white'
        }}
    />
  );
};

const HomeBase = ({ color, tokens, turnIndex, onTokenClick }) => {
  const isMyTurn = PLAYERS[turnIndex] === color;
  const colSpan = (color === 'RED' || color === 'GREEN') ? '1 / span 6' : '10 / span 6';
  const rowSpan = (color === 'RED' || color === 'BLUE') ? '1 / span 6' : '10 / span 6';

  return (
    <div className="home-base" style={{ backgroundColor: COLORS[color], gridColumn: colSpan, gridRow: rowSpan }}>
      <div className="inner-base bg-white/90 p-3 grid grid-cols-2 gap-3 rounded-2xl shadow-inner">
        {tokens.map((pos, i) => (
          <div key={i} className="base-token-slot bg-gray-100 rounded-full flex items-center justify-center relative">
            {pos === -1 && (
              <div 
                onClick={() => onTokenClick(i)}
                className={`ludo-token cursor-pointer ${isMyTurn ? 'active' : ''}`} 
                style={{ backgroundColor: COLORS[color], width: '80%', height: '80%' }} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APPLICATION ---
export default function App({ onExit, session }) {
  const [view, setView] = useState('Menu'); // Menu, Game
  const [roomCode, setRoomCode] = useState('');
  const { room, players, isRolling, diceValue, moveToken } = useLudoEngine(roomCode);

  const startLocalGame = () => setView('Game');
  const joinMultiplayer = () => {
      if (roomCode.length === 6) setView('Game');
  };

  if (view === 'Menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 tracking-widest mb-2 drop-shadow-2xl">LUDO PRO</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">SpacetimeDB Unified Edition</p>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
          <button onClick={startLocalGame} className="flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl group border-b-4 border-cyan-800">
            <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" /> Local Play
          </button>
          
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl mt-4">
              <input 
                placeholder="Enter 6-Digit Code" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white mb-2 text-center font-bold tracking-widest"
              />
              <button 
                onClick={joinMultiplayer} 
                className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all border border-gray-700 disabled:opacity-50"
              >
                <LogIn className="w-5 h-5" /> Join Room
              </button>
          </div>

          <button onClick={onExit} className="mt-8 text-gray-600 hover:text-white text-xs uppercase tracking-widest font-bold transition-all">Back to Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <button onClick={() => setView('Menu')} className="p-2 hover:bg-gray-900 rounded-lg text-gray-500 hover:text-white transition-colors"><ChevronLeft /></button>
          <div className="text-center">
              <h2 className="text-2xl font-black text-cyan-500 uppercase tracking-widest leading-none">LUDO PRO</h2>
              <p className="text-[10px] text-gray-500 uppercase mt-1">Status: <span className="text-white">Live Session</span></p>
          </div>
          <div className="w-10"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        {/* Board Container */}
        <div className="bg-slate-900 p-2 sm:p-4 rounded-xl border border-slate-800 shadow-2xl w-full max-w-[600px]">
          <div className="ludo-grid relative">
            {/* Grid Rendering */}
            {Array.from({ length: 225 }).map((_, i) => (
                <div key={i} className="ludo-cell bg-slate-100 opacity-10" />
            ))}

            {/* Bases */}
            {PLAYERS.map(color => (
                <HomeBase 
                    key={color} 
                    color={color} 
                    tokens={players.find(p => p.id === color)?.tokens || []} 
                    turnIndex={room.turn_index}
                    onTokenClick={(idx) => moveToken(idx)}
                />
            ))}

            {/* Tokens */}
            {players.map(p => (
                p.tokens.map((pos, idx) => (
                    <Token 
                        key={`${p.id}-${idx}`} 
                        color={p.id} 
                        index={idx} 
                        position={pos} 
                        isActive={PLAYERS[room.turn_index] === p.id}
                        onClick={() => moveToken(idx)}
                    />
                ))
            ))}
          </div>
        </div>

        {/* HUD Controls */}
        <div className="w-full lg:w-72 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
                <p className="text-gray-500 text-[10px] uppercase font-black mb-4 tracking-widest">Active Turn</p>
                <div className="flex items-center gap-3 mb-8 bg-black/40 px-6 py-3 rounded-full border border-slate-800">
                    <div className={`w-4 h-4 rounded-full animate-pulse shadow-[0_0_12px_currentColor]`} style={{ color: COLORS[PLAYERS[room.turn_index]] }} />
                    <span className="font-bold text-white uppercase text-sm tracking-widest">{PLAYERS[room.turn_index]}</span>
                </div>

                {/* Score Summary */}
                <div className="w-full space-y-3 mb-10">
                    {players.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-slate-800/50">
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60" style={{ color: COLORS[p.id] }}>{p.id}</span>
                            <div className="flex gap-1">
                                {p.tokens.map((t, i) => (
                                    <div key={i} className={`w-2 h-2 rounded-full ${t === 57 ? 'bg-green-500' : t === -1 ? 'bg-slate-700' : 'bg-slate-300 animate-pulse'}`} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-4xl font-black text-cyan-500 mb-6 bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center border-b-4 border-slate-950">
                    {diceValue}
                </div>

                <p className="text-gray-500 text-[10px] text-center w-full uppercase font-bold tracking-widest opacity-60">Click on your token to move after rolling</p>
            </div>
        </div>
      </div>
    </div>
  );
}

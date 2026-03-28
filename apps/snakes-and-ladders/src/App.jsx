import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Dices, Trophy, AlertTriangle, RefreshCcw, User, Info, 
  Map, Users, PlusCircle, LogIn, ChevronLeft 
} from 'lucide-react';
import './index.css';
import { useMockSpacetimeEngine } from './engine';

/* ========================================================================
   SNAKES & LADDERS - ORIGINAL UI (RESTORED)
   ======================================================================== */

const BOARD_SIZE = 10;
const TOTAL_CELLS = 100;

// Game Config (Original)
const SNAKES = { 16: 6, 47: 26, 49: 11, 56: 37, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78 };
const LADDERS = { 1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100 };

export default function App({ onExit, session }) {
  const { room, players, isRolling, diceValue, createRoom, joinRoom, moveToken } = useMockSpacetimeEngine();
  const [view, setView] = useState('Menu'); // Menu, Create, Join, Lobby, Game
  const [tempRoomName, setTempRoomName] = useState('');
  const [tempRoomCode, setTempRoomCode] = useState('');

  // Handle Board Generation (Original)
  const cells = useMemo(() => {
    const list = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const rowArr = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        const id = (BOARD_SIZE - 1 - r) * BOARD_SIZE + (r % 2 === 0 ? c + 1 : BOARD_SIZE - c);
        rowArr.push(id);
      }
      list.push(rowArr);
    }
    return list;
  }, []);

  const handleCreate = () => {
    const code = createRoom(tempRoomName || 'My Room');
    setView('Lobby');
  };

  const handleJoin = () => {
    joinRoom(tempRoomCode);
    setView('Lobby');
  };

  const rollDice = () => {
    if (isRolling) return;
    const value = Math.floor(Math.random() * 6) + 1;
    moveToken(room.code, value);
  };

  if (view === 'Menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-rose-600 tracking-widest mb-2 drop-shadow-2xl">SNAKES & LADDERS</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Classic Multiplayer Board Game</p>
        </div>
        <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
          <button onClick={() => setView('Create')} className="flex items-center justify-center gap-3 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl group">
            <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform" /> Host Game
          </button>
          <button onClick={() => setView('Join')} className="flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl group border border-gray-700">
            <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> Join Game
          </button>
          <button onClick={onExit} className="mt-4 text-gray-600 hover:text-white text-xs uppercase tracking-widest font-bold transition-all">Back to Hub</button>
        </div>
      </div>
    );
  }

  if (view === 'Create' || view === 'Join') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm">
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest text-center">{view === 'Create' ? 'Host Game' : 'Join Room'}</h2>
            <input 
              type="text" 
              placeholder={view === 'Create' ? 'Enter Room Name' : 'Enter 6-Digit Code'} 
              value={view === 'Create' ? tempRoomName : tempRoomCode}
              onChange={(e) => view === 'Create' ? setTempRoomName(e.target.value) : setTempRoomCode(e.target.value)}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white mb-6 focus:border-pink-500 transition-colors"
            />
            <div className="flex gap-3">
              <button onClick={() => setView('Menu')} className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors">Cancel</button>
              <button onClick={view === 'Create' ? handleCreate : handleJoin} className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-500 transition-colors">Confirm</button>
            </div>
        </div>
      </div>
    );
  }

  if (view === 'Lobby') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6">
        <div className="bg-gray-900 border border-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">
            <div className="mb-6">
                <p className="text-gray-500 text-[10px] uppercase font-black mb-1">Room Code</p>
                <h3 className="text-4xl font-black text-pink-500 tracking-widest">{room.code}</h3>
            </div>
            <div className="space-y-4 mb-10">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Connected Players</p>
                <div className="grid grid-cols-2 gap-3">
                    {players.map((p, i) => (
                        <div key={i} className="bg-black/50 border border-gray-800 rounded-xl p-3 flex flex-col items-center">
                            <User className={`w-8 h-8 mb-2 ${p.color === 'RED' ? 'text-rose-500' : 'text-cyan-500'}`} />
                            <span className="text-white text-xs font-bold">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => setView('Game')} className="w-64 bg-pink-600 hover:bg-pink-500 text-white font-bold py-4 rounded-xl shadow-xl uppercase tracking-widest text-lg">Start Game</button>
        </div>
      </div>
    );
  }

  // --- GAME BOARD VIEW ---
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-4">
      {/* Header HUD */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
          <button onClick={() => setView('Menu')} className="p-2 hover:bg-gray-900 rounded-lg text-gray-500 hover:text-white transition-colors"><ChevronLeft /></button>
          <div className="text-center">
              <h2 className="text-2xl font-black text-pink-500 uppercase tracking-widest leading-none">Snakes & Ladders</h2>
              <p className="text-[10px] text-gray-500 uppercase mt-1">Room: <span className="text-white">{room.code}</span></p>
          </div>
          <div className="w-10"></div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl">
        {/* Game Area */}
        <div className="flex-1 w-full bg-gray-900/50 p-4 sm:p-6 rounded-[2rem] border border-gray-800/50 shadow-2xl">
          <div className="aspect-square w-full grid grid-cols-10 grid-rows-10 gap-1 sm:gap-1.5 relative snl-board-container">
            {cells.flat().map(id => (
              <div key={id} className={`relative flex items-center justify-center transition-all duration-300 rounded-lg sm:rounded-xl border ${id % 2 === 0 ? 'bg-gray-800/40 border-gray-700/30' : 'bg-gray-900/40 border-gray-700/20'}`}>
                <span className="text-[10px] font-bold text-gray-600 absolute bottom-1 right-1 opacity-50">{id}</span>
                
                {/* Visual Indicators for Snakes/Ladders */}
                {SNAKES[id] && <div className="absolute inset-0 border-2 border-rose-500/20 rounded-lg flex items-center justify-center overflow-hidden"><div className="w-full h-1 bg-red-500/30 -rotate-45" /></div>}
                {LADDERS[id] && <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-lg flex items-center justify-center overflow-hidden"><div className="w-full h-1 bg-cyan-500/30 rotate-45" /></div>}

                {/* Player Tokens */}
                {players.map((p, i) => (
                  p.position === id && (
                    <div key={i} className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-2xl transform transition-all duration-500 hover:scale-110 flex items-center justify-center border-2 z-10 ${p.color === 'RED' ? 'bg-rose-500 border-rose-300' : 'bg-cyan-500 border-cyan-300'}`}>
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right HUD Controls */}
        <div className="w-full lg:w-72 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
              <p className="text-gray-500 text-[10px] uppercase font-black mb-4">Current Turn</p>
              <div className="flex items-center gap-3 mb-8 bg-black/40 px-4 py-2 rounded-xl">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${room.turn_index === 0 ? 'bg-rose-500' : 'bg-cyan-500'}`} />
                  <span className="font-bold text-white uppercase text-sm tracking-widest">{players[room.turn_index]?.name}</span>
              </div>

              {/* 3D Dice */}
              <div className="mb-10 p-6 bg-black/20 rounded-2xl">
                  <div className={`dice-container ${isRolling ? 'rolling' : ''} transform-gpu`}>
                      <div className="dice-face face-1"><div className="dot" /></div>
                      <div className="dice-face face-2"><div className="flex gap-4"><div className="dot" /><div className="dot" /></div></div>
                      <div className="dice-face face-3"><div className="dot" /></div>
                      <div className="dice-face face-4"><div className="dot" /></div>
                      <div className="dice-face face-5"><div className="dot" /></div>
                      <div className="dice-face face-6"><div className="grid grid-cols-2 gap-1"><div className="dot" /><div className="dot" /><div className="dot" /><div className="dot" /><div className="dot" /><div className="dot" /></div></div>
                  </div>
              </div>

              <button 
                onClick={rollDice} 
                disabled={isRolling}
                className="w-full bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
              >
                  Roll Dice
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

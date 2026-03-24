import React, { useState } from 'react';
import { Gamepad2, LayoutGrid, Swords, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeoButton, NeoCard, NeoTag } from '@classic-games/shared-ui';

// Games are now imported as workspace packages
import SnakeArena from '@classic-games/snake-arena';
import SnakesAndLadders from '@classic-games/snakes-and-ladders';
import Ludo from '@classic-games/ludo-pro';

const GAMES = [
  {
    id: 'snake',
    name: 'Snake Arena',
    description: 'Grow your snake and dominate the arena in this 3-mode real-time classic.',
    icon: <Zap size={40} />,
    color: 'bg-red-500',
    tags: ['Real-time', 'PvP', 'AI'],
    component: SnakeArena
  },
  {
    id: 'sl',
    name: 'Snakes & Ladders',
    description: 'The ancient Indian board game with multiple themes and SpacetimeDB multiplayer.',
    icon: <Swords size={40} />,
    color: 'bg-yellow-500',
    tags: ['Board', 'Turns', '4 Themes'],
    component: SnakesAndLadders
  },
  {
    id: 'ludo',
    name: 'Ludo Modern',
    description: 'Classic Ludo with a modern Rust engine and real-time capture mechanics.',
    icon: <LayoutGrid size={40} />,
    color: 'bg-blue-500',
    tags: ['Board', 'Strategy', 'Multiplayer'],
    component: Ludo
  }
];

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  if (activeGame) {
    const GameComponent = GAMES.find(g => g.id === activeGame).component;
    return (
      <div className="relative">
        <button 
          onClick={() => setActiveGame(null)}
          className="fixed top-4 left-4 z-[9999] bg-white border-4 border-black px-4 py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
        >
          ← Back to Hub
        </button>
        <GameComponent onExit={() => setActiveGame(null)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-black font-mono p-4 md:p-12 overflow-x-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <div className="relative inline-block mb-10">
          <div className="bg-black text-white px-8 py-6 border-8 border-black shadow-[12px_12px_0px_0px_#ff2a2a] -rotate-1">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">Classic Hub</h1>
            <p className="text-sm md:text-lg font-bold text-gray-400 mt-2 uppercase tracking-widest">Advanced Game Collection</p>
          </div>
          <div className="absolute -top-6 -right-10 bg-yellow-300 border-4 border-black px-4 py-2 rotate-12 shadow-[4px_4px_0px_0px_#000]">
             <span className="font-black text-xs">V2.0.0</span>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {GAMES.map((game, idx) => (
          <NeoCard key={game.id} delay={idx * 0.1}>
            <div className={`p-4 ${game.color} border-4 border-black mb-6 text-white shadow-[4px_4px_0px_0px_#000]`}>
              {game.icon}
            </div>
            
            <h2 className="text-3xl font-black uppercase mb-4 leading-none">{game.name}</h2>
            <p className="text-sm font-bold text-gray-500 mb-8 flex-grow">{game.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {game.tags.map(tag => <NeoTag key={tag}>{tag}</NeoTag>)}
            </div>

            <NeoButton 
              onClick={() => setActiveGame(game.id)}
              color={game.color}
              className="w-full"
              icon={ChevronRight}
            >
              Launch Game
            </NeoButton>
          </NeoCard>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="mt-20 text-center">
        <div className="inline-flex gap-8 text-[12px] font-black uppercase opacity-20">
          <span>SpacetimeDB Powered</span>
          <span>Turbo Monorepo</span>
          <span>Shared UI Framework</span>
        </div>
      </div>
    </div>
  );
}

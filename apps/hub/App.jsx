import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Workspace Imports
import SnakeArena from '@classic-games/snake-arena';
import SnakesAndLadders from '@classic-games/snakes-and-ladders';
import Ludo from '@classic-games/ludo-pro';

// New Kinetic Components
import { KineticHero } from './components/KineticHero';
import { ShatteringCluster } from './components/ShatteringCluster';
import { PersonaAuth } from './components/PersonaAuth';

export default function App() {
  const [step, setStep] = useState('HERO'); // HERO -> CLUSTER -> AUTH -> GAME
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [authMode, setAuthMode] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
    setStep('AUTH');
  };

  const handleLogin = (mode) => {
    setAuthMode(mode);
    setStep('GAME');
  };

  const renderGame = () => {
    switch (selectedGameId) {
      case 'snake-arena': return <SnakeArena onExit={() => setStep('CLUSTER')} session={authMode} />;
      case 'snakes-ladders': return <SnakesAndLadders onExit={() => setStep('CLUSTER')} session={authMode} />;
      case 'ludo-pro': return <Ludo onExit={() => setStep('CLUSTER')} session={authMode} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-white font-body selection:bg-[var(--color-primary)] selection:text-black">
      <AnimatePresence mode="wait">
        {step === 'HERO' && (
          <KineticHero key="hero" onEnter={() => setStep('CLUSTER')} />
        )}

        {step === 'CLUSTER' && (
          <ShatteringCluster key="cluster" onGameSelect={handleGameSelect} />
        )}

        {step === 'AUTH' && (
          <PersonaAuth key="auth" gameId={selectedGameId} onLogin={handleLogin} />
        )}

        {step === 'GAME' && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full min-h-screen"
          >
            {/* Minimalist Back Button */}
            <button 
              onClick={() => setStep('CLUSTER')}
              className="fixed top-4 left-4 z-[9999] px-4 py-2 bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-display font-bold uppercase text-xs hover:bg-[var(--color-primary)] hover:text-black transition-all"
            >
              Abort Mission
            </button>
            
            {renderGame()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassBrutalistCard, KineticButton } from '@classic-games/shared-ui';
import { Copy, Check, Users, User, LogIn, Plus } from 'lucide-react';

export const PersonaAuth = ({ gameId, onLogin }) => {
  const [mode, setMode] = useState('SOLO'); // SOLO or COOP
  const [action, setAction] = useState('HOST'); // HOST or JOIN
  const [roomId, setRoomId] = useState('');
  const [callsign, setCallsign] = useState(localStorage.getItem('arc_callsign') || 'PLAYER_1');
  const [copied, setCopied] = useState(false);

  // Generate random room ID on host click
  const generateRoomId = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(code);
    setAction('HOST');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    localStorage.setItem('arc_callsign', callsign);
    onLogin({
      mode,
      action: mode === 'SOLO' ? 'SOLO' : action,
      roomId: mode === 'SOLO' ? 'LOCAL' : roomId,
      callsign
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-[var(--color-surface)] z-40 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-secondary)]/10 to-[var(--color-primary)]/10 pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        <GlassBrutalistCard neonColor={mode === 'SOLO' ? 'var(--color-primary)' : 'var(--color-secondary)'}>
          <div className="w-full flex justify-between items-start mb-6">
            <div>
              <h2 className="text-5xl font-display font-black uppercase tracking-tighter shadow-text">IDENTITY GATE</h2>
              <p className="font-body text-gray-400 uppercase text-xs tracking-widest border-l-4 border-[var(--color-primary)] pl-2">System // {gameId.replace('-', ' ')}</p>
            </div>
          </div>
          
          {/* Main Mode Toggle */}
          <div className="flex gap-4 mb-8 w-full border-b-[4px] border-black pb-4">
            <button 
              onClick={() => setMode('SOLO')}
              className={`flex-1 flex items-center justify-center gap-2 font-display font-black text-xl uppercase pb-2 transition-colors ${mode === 'SOLO' ? 'text-[var(--color-primary)] border-b-4 border-[var(--color-primary)]' : 'text-gray-600'}`}
            >
              <User size={20} /> SOLO OPS
            </button>
            <button 
              onClick={() => { setMode('COOP'); if(!roomId) generateRoomId(); }}
              className={`flex-1 flex items-center justify-center gap-2 font-display font-black text-xl uppercase pb-2 transition-colors ${mode === 'COOP' ? 'text-[var(--color-secondary)] border-b-4 border-[var(--color-secondary)]' : 'text-gray-600'}`}
            >
              <Users size={20} /> CO-OP / VERSUS
            </button>
          </div>

          <div className="w-full space-y-8">
            {/* Callsign Input - Always Visible */}
            <div className="relative">
              <label className="absolute -top-3 left-4 bg-[var(--color-surface-container)] px-2 font-display font-bold uppercase text-xs text-white">Callsign</label>
              <input 
                type="text" 
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                className="w-full bg-[var(--color-surface-container)]/80 border-4 border-black p-4 font-display text-xl text-white focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                placeholder="ENTER CALLSIGN..."
              />
            </div>

            <AnimatePresence mode="wait">
              {mode === 'COOP' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 pt-4 border-t-2 border-white/5"
                >
                  <div className="flex gap-4">
                    <button 
                      onClick={() => { if(!roomId) generateRoomId(); setAction('HOST'); }}
                      className={`flex-1 p-3 border-4 border-black font-display font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${action === 'HOST' ? 'bg-[var(--color-secondary)] text-white translate-x-1 translate-y-1' : 'bg-black text-gray-500'}`}
                    >
                      <Plus size={16} /> Host Room
                    </button>
                    <button 
                      onClick={() => setAction('JOIN')}
                      className={`flex-1 p-3 border-4 border-black font-display font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${action === 'JOIN' ? 'bg-[var(--color-primary)] text-white translate-x-1 translate-y-1' : 'bg-black text-gray-500'}`}
                    >
                      <LogIn size={16} /> Join Room
                    </button>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-3 left-4 bg-[var(--color-surface-container)] px-2 font-display font-bold uppercase text-xs text-secondary">
                      {action === 'HOST' ? 'SESSION TOKEN' : 'ENTER TOKEN'}
                    </label>
                    <div className="flex items-center gap-2 bg-[var(--color-surface-container)]/80 border-4 border-black p-4 focus-within:border-[var(--color-secondary)] transition-colors">
                      <input 
                        type="text" 
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                        readOnly={action === 'HOST'}
                        className="flex-grow bg-transparent font-display text-2xl text-white focus:outline-none placeholder:opacity-20"
                        placeholder="XXXXXX"
                      />
                      {action === 'HOST' && (
                        <button 
                          onClick={handleCopy}
                          className={`p-2 transition-colors ${copied ? 'text-green-400' : 'hover:text-[var(--color-secondary)]'}`}
                        >
                          {copied ? <Check size={24} /> : <Copy size={24} />}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <KineticButton 
            onClick={handleSubmit} 
            glowColor={mode === 'SOLO' ? 'var(--color-primary)' : 'var(--color-secondary)'}
            className="w-full text-2xl py-6 mt-10"
          >
            {mode === 'SOLO' ? 'INITIATE SOLO MISSION' : action === 'HOST' ? 'ESTABLISH SESSION' : 'SYNC TO SESSION'}
          </KineticButton>
        </GlassBrutalistCard>
      </div>
    </motion.div>
  );
};

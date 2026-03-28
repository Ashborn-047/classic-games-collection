import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { GlassBrutalistCard, KineticButton, NeoTag } from '@classic-games/shared-ui';

export const ShatteringCluster = ({ onGameSelect }) => {
  const clusterRef = useRef(null);

  useEffect(() => {
    // Parallax effect on mouse move
    const handleMouseMove = (e) => {
      if (!clusterRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      gsap.to('.cluster-item', {
        x: (index, target) => x * parseFloat(target.dataset.depth || 1),
        y: (index, target) => y * parseFloat(target.dataset.depth || 1),
        duration: 0.5,
        ease: 'power1.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const games = [
    {
      id: 'snake-arena',
      title: 'Snake Arena',
      desc: 'Neon grid survival. Real-time PvPAI. Eat or be eaten.',
      tags: ['Local', 'Real-Time', 'Neon-Action'],
      color: 'var(--color-secondary)' // Red
    },
    {
      id: 'snakes-ladders',
      title: 'Snakes & Ladders',
      desc: 'The ancient Indian board game reconstructed for the digital age.',
      tags: ['SpacetimeDB', 'Turn-Based'],
      color: 'var(--color-primary)' // Cyan
    },
    {
      id: 'ludo-pro',
      title: 'Ludo Pro',
      desc: 'High-stakes tactical captures. Secure your base.',
      tags: ['Board Strategy', 'Multiplayer'],
      color: 'var(--color-accent)' // Yellow
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative min-h-screen w-full flex items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Kinetic Logo */}
      <h1 className="absolute text-[20vw] font-display font-black text-[var(--color-surface-bright)] opacity-10 pointer-events-none select-none tracking-tighter mix-blend-screen -z-10" style={{ top: '-10%', left: '-5%' }}>MODULES</h1>

      {/* The Cluster */}
      <div ref={clusterRef} className="relative w-full max-w-6xl flex flex-wrap justify-center items-center gap-12 z-10">
        {games.map((game, i) => {
          // Calculate asymmetric layout (for a 'shattered' non-grid feel)
          const isOffset = i % 2 !== 0;
          
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 100, rotate: isOffset ? -5 : 5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: i * 0.2, type: 'spring', damping: 20 }}
              className={`cluster-item w-full md:w-[45%] lg:w-[30%] ${isOffset ? 'md:-translate-y-16' : 'md:translate-y-16'}`}
              data-depth={i * 0.5 + 1} // for parallax
            >
              <GlassBrutalistCard neonColor={game.color} className="h-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.tags.map(t => <NeoTag key={t}>{t}</NeoTag>)}
                </div>
                <h2 className="text-4xl font-display font-black uppercase mb-4" style={{ textShadow: `0 0 10px ${game.color}80` }}>
                  {game.title}
                </h2>
                <p className="text-gray-300 mb-8 flex-grow">{game.desc}</p>
                
                <KineticButton 
                  onClick={() => onGameSelect(game.id)} 
                  glowColor={game.color}
                  className="w-full mt-auto"
                >
                  Initiate
                </KineticButton>
              </GlassBrutalistCard>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

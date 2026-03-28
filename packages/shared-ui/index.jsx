import React from 'react';
import { motion } from 'framer-motion';

/**
 * Kinetic Glass-Brutalist Card
 * Features an 8px solid black border with a frosted glass interior.
 */
export const GlassBrutalistCard = ({ children, className = '', delay = 0, neonColor = 'var(--color-primary)' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    className={`relative group ${className}`}
  >
    {/* Inner Neon Glow on Hover */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{ boxShadow: `inset 0 0 20px ${neonColor}40` }}
    />
    
    {/* Deep Backdrop Blur Container with 8px Border */}
    <div className="relative bg-[#1a1919]/60 backdrop-blur-2xl border-[8px] border-black p-8 h-full flex flex-col items-start overflow-hidden transition-all duration-300 group-hover:border-[var(--color-primary)]">
      {children}
    </div>
  </motion.div>
);

/**
 * Kinetic Button (GSAP-style interactions simulated with Framer Motion)
 * Background has a vertical gradient, 8px border, and shifts on hover.
 */
export const KineticButton = ({ children, onClick, className = '', glowColor = 'var(--color-primary)' }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.95, y: 0 }}
    className={`relative group focus-visible:outline-none ${className}`}
  >
    {/* Outer Glow on Hover */}
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-screen"
      style={{ boxShadow: `0 0 15px ${glowColor}` }}
    />
    
    <div className="relative bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dim)] text-black border-[8px] border-black px-8 py-4 font-display font-black uppercase tracking-tight flex items-center justify-center gap-2">
      {children}
    </div>
  </motion.button>
);

/**
 * Neo Tag
 */
export const NeoTag = ({ children, className = '' }) => (
  <span className={`bg-[var(--color-surface-bright)] border-4 border-black px-3 py-1 text-xs font-display font-black uppercase text-white ${className}`}>
    {children}
  </span>
);

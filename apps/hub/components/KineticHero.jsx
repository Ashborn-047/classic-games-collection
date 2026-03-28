import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export const KineticHero = ({ onEnter }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    // GSAP Shatter/Glitch entry effect
    const ctx = gsap.context(() => {
      gsap.fromTo(textRef.current, 
        { scale: 3, opacity: 0, rotationX: 90, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, rotationX: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power4.out' }
      );
      
      // Floating particles
      if (particlesRef.current) {
        gsap.to('.particle', {
          y: 'random(-500, 500)',
          x: 'random(-500, 500)',
          rotation: 'random(-180, 180)',
          duration: 'random(10, 20)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.1
        });
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(30px)', scale: 1.2, transition: { duration: 0.8 } }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[var(--color-surface)] z-50 overflow-hidden"
    >
      {/* Background Particles Container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle absolute top-1/2 left-1/2 w-4 h-4 bg-[var(--color-primary)] opacity-50 shadow-[0_0_15px_var(--color-primary)] mix-blend-screen" />
        ))}
      </div>

      {/* Massive Scanlines Overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        <h1 
          ref={textRef}
          className="text-7xl md:text-9xl font-display font-black uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-[-0.05em] text-center"
          style={{ textShadow: '0 0 40px rgba(255,255,255,0.2)' }}
        >
          Classic<br/>
          <span className="text-[var(--color-primary)] text-8xl md:text-10xl neon-text">Arcade</span>
        </h1>
        
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          animate={{ 
            boxShadow: ['0 0 10px var(--color-primary)', '0 0 30px var(--color-primary)', '0 0 10px var(--color-primary)'],
            transition: { duration: 2, repeat: Infinity }
          }}
          className="px-12 py-4 bg-transparent border-[8px] border-[var(--color-primary)] text-[var(--color-primary)] font-display font-black text-3xl uppercase tracking-widest backdrop-blur-md hover:bg-[var(--color-primary)] hover:text-black transition-colors duration-300"
        >
          Press Start
        </motion.button>
      </div>
    </motion.div>
  );
};

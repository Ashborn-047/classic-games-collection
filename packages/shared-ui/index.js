import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Neo-Brutalist Button
 */
export const NeoButton = ({ children, onClick, className = '', color = 'bg-blue-500', icon: Icon }) => (
  <button 
    onClick={onClick}
    className={`relative group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 ${className}`}
  >
    <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
    <div className={`relative ${color} text-white border-4 border-black px-6 py-3 font-black uppercase flex items-center justify-center gap-2 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-all`}>
      {children}
      {Icon && <Icon size={20} />}
    </div>
  </button>
);

/**
 * Neo-Brutalist Card
 */
export const NeoCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative group ${className}`}
  >
    <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform" />
    <div className="relative bg-white border-8 border-black p-8 h-full flex flex-col items-start transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
      {children}
    </div>
  </motion.div>
);

/**
 * High-Contrast Tag
 */
export const NeoTag = ({ children }) => (
  <span className="bg-gray-100 border-2 border-black px-2 py-1 text-[10px] font-black uppercase">
    {children}
  </span>
);

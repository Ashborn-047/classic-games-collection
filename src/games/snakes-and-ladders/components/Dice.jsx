import React from 'react';
import { Dices } from 'lucide-react';

export default function Dice({ value, isRolling, theme }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`w-20 h-20 bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transition-all ${isRolling ? 'rotate-12 animate-bounce' : ''}`}
      >
        {isRolling ? (
          <Dices size={40} className="animate-spin text-gray-400" />
        ) : (
          <span className="text-4xl font-black">{value || '?'}</span>
        )}
      </div>
      <p className="text-xs font-black uppercase text-gray-500">
        {isRolling ? 'Rolling...' : value ? `Rolled ${value}` : 'Ready'}
      </p>
    </div>
  );
}

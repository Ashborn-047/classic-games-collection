export const GRID_SIZE = 10;
export const BOARD_SIZE = 100;

export const SNAKES = {
  16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
};

export const LADDERS = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
};

export const THEMES = {
  classic: {
    name: 'Classic',
    bg: 'bg-white',
    cell: 'bg-white',
    border: 'border-slate-200',
    primary: '#ef4444',
    secondary: '#3b82f6',
    snake: '#10b981',
    ladder: '#f59e0b'
  },
  dungeon: {
    name: 'Dungeon',
    bg: 'bg-slate-900',
    cell: 'bg-slate-800',
    border: 'border-slate-700',
    primary: '#991b1b',
    secondary: '#3730a3',
    snake: '#065f46',
    ladder: '#92400e'
  },
  cyber: {
    name: 'Cyberpunk',
    bg: 'bg-zinc-950',
    cell: 'bg-zinc-900',
    border: 'border-cyan-500/30',
    primary: '#f0abfc',
    secondary: '#22d3ee',
    snake: '#4ade80',
    ladder: '#fbbf24'
  },
  forest: {
    name: 'Mystic Forest',
    bg: 'bg-emerald-950',
    cell: 'bg-emerald-900',
    border: 'border-emerald-800',
    primary: '#fcd34d',
    secondary: '#60a5fa',
    snake: '#10b981',
    ladder: '#b45309'
  }
};

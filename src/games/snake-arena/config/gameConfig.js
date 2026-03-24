// Snake Arena — Game Configuration
export const GRID_SIZE = 20;
export const CELL_SIZE = 28;
export const TICK_SPEEDS = { slow: 200, normal: 140, fast: 90 };
export const INITIAL_SNAKE_LENGTH = 3;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

export const AI_LEVELS = {
  chill: { name: 'Chill', desc: 'Random wanderer', color: '#84cc16' },
  smart: { name: 'Smart', desc: 'Pathfinds to food', color: '#f59e0b' },
  ruthless: { name: 'Ruthless', desc: 'Hunts you down', color: '#ef4444' },
};

export const FOOD_TYPES = {
  normal: { emoji: '🍎', points: 10, growth: 1 },
  bonus: { emoji: '⭐', points: 25, growth: 2 },
  speed: { emoji: '⚡', points: 5, growth: 0, effect: 'speed' },
  shield: { emoji: '🛡️', points: 5, growth: 0, effect: 'shield' },
};

export const PLAYER_COLORS = {
  p1: '#ff2a2a',
  p2: '#2a5aff',
  ai: '#8b5cf6',
};

export const generateRoomCode = () =>
  Math.random().toString(36).substring(2, 6).toUpperCase();

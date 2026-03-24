import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Snake Arena Game Store
 * Handles local state, input buffering, and server-sync data.
 */
export const useSnakeStore = create(
  immer((set, get) => ({
    // Game Configuration
    gridSize: 20,
    tickRate: 150,
    
    // Core State
    gameState: 'LOBBY', // LOBBY, PLAYING, GAME_OVER
    snakes: {},        // { id: { segments: [], color, direction, score } }
    food: [],          // [ { x, y, type } ]
    
    // UI State
    score: 0,
    highScore: 0,
    
    // Actions
    setGameState: (state) => set((s) => { s.gameState = state; }),
    
    updateStateFromServer: (serverData) => set((s) => {
      s.snakes = serverData.snakes;
      s.food = serverData.food;
      s.gameState = serverData.gameState;
    }),
    
    // Local Input Buffering
    inputBuffer: [],
    addInput: (direction) => set((s) => {
      // Limit buffer depth to 2 as per plan
      if (s.inputBuffer.length < 2) {
        s.inputBuffer.push(direction);
      }
    }),
    consumeInput: () => set((s) => {
      s.inputBuffer.shift();
    })
  }))
);

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Snake Arena Game Store
 * Handles local state, input buffering, and server-sync data.
 */
interface Point { x: number; y: number; }
interface FoodItem { x: number; y: number; type: string; }
interface Snake { segments: Point[]; color: string; direction: string; score: number; isAlive: boolean; }

interface SnakeState {
  gridSize: number;
  tickRate: number;
  gameState: 'LOBBY' | 'PLAYING' | 'GAME_OVER';
  snakes: Record<string, Snake>;
  food: FoodItem[];
  score: number;
  highScore: number;
  inputBuffer: string[];
  setGameState: (state: 'LOBBY' | 'PLAYING' | 'GAME_OVER') => void;
  updateStateFromServer: (serverData: any) => void;
  addInput: (direction: string) => void;
  consumeInput: () => void;
}

export const useSnakeStore = create<SnakeState>()(
  immer((set) => ({
    gridSize: 20,
    tickRate: 150,
    gameState: 'LOBBY',
    snakes: {},
    food: [],
    score: 0,
    highScore: 0,
    inputBuffer: [],

    setGameState: (state) => set((s) => { s.gameState = state; }),
    
    updateStateFromServer: (serverData) => set((s) => {
      s.snakes = serverData.snakes;
      s.food = serverData.food;
      s.gameState = serverData.gameState;
    }),
    
    addInput: (direction) => set((s) => {
      if (s.inputBuffer.length < 2) {
        s.inputBuffer.push(direction);
      }
    }),
    consumeInput: () => set((s) => {
      s.inputBuffer.shift();
    })
  }))
);

/**
 * Shared Type Definitions for Classic Games
 */

export const ROOM_STATUS = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED'
};

export const PLAYER_COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];

/**
 * Snake Arena Models
 */
export interface Point { x: number; y: number; }
export interface FoodItem { x: number; y: number; type: string; }
export interface Snake { 
  segments: Point[]; 
  color: string; 
  direction: string; 
  score: number; 
  isAlive: boolean; 
}

/**
 * Snakes & Ladders Models
 */
export interface SnLPlayer {
  identity: string;
  name: string;
  position: number; // 1-100
  color: string;
}

export interface SnLRoom {
  code: string;
  status: string;
  players: SnLPlayer[];
  turnIndex: number;
}

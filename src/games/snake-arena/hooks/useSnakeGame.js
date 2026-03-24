import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GRID_SIZE, DIRECTIONS, OPPOSITE, FOOD_TYPES,
  TICK_SPEEDS, INITIAL_SNAKE_LENGTH, PLAYER_COLORS
} from '../config/gameConfig';

const createInitialSnake = (startX, startY, length, direction = 'RIGHT') => {
  const segments = [];
  const dir = DIRECTIONS[direction];
  for (let i = 0; i < length; i++) {
    segments.push({ x: startX - dir.x * i, y: startY - dir.y * i });
  }
  return segments;
};

const spawnFood = (occupiedCells) => {
  const occupied = new Set(occupiedCells.map(c => `${c.x},${c.y}`));
  let x, y;
  let attempts = 0;
  do {
    x = Math.floor(Math.random() * GRID_SIZE);
    y = Math.floor(Math.random() * GRID_SIZE);
    attempts++;
  } while (occupied.has(`${x},${y}`) && attempts < 500);

  const rand = Math.random();
  let type = 'normal';
  if (rand > 0.92) type = 'shield';
  else if (rand > 0.85) type = 'speed';
  else if (rand > 0.75) type = 'bonus';

  return { x, y, type };
};

const checkSelfCollision = (head, body) => {
  return body.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y);
};

const checkWallCollision = (head) => {
  return head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE;
};

export function useSnakeGame(mode = 'solo', tickSpeed = 'normal') {
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameover
  const [snake1, setSnake1] = useState([]);
  const [snake2, setSnake2] = useState([]);
  const [dir1, setDir1] = useState('RIGHT');
  const [dir2, setDir2] = useState('LEFT');
  const [food, setFood] = useState(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [winner, setWinner] = useState(null);
  const [activeEffects, setActiveEffects] = useState({ p1: null, p2: null });
  const [logs, setLogs] = useState([]);

  const dir1Ref = useRef(dir1);
  const dir2Ref = useRef(dir2);
  const snake1Ref = useRef(snake1);
  const snake2Ref = useRef(snake2);
  const foodRef = useRef(food);
  const gameStateRef = useRef(gameState);
  const effectsRef = useRef(activeEffects);

  useEffect(() => { dir1Ref.current = dir1; }, [dir1]);
  useEffect(() => { dir2Ref.current = dir2; }, [dir2]);
  useEffect(() => { snake1Ref.current = snake1; }, [snake1]);
  useEffect(() => { snake2Ref.current = snake2; }, [snake2]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { effectsRef.current = activeEffects; }, [activeEffects]);

  const addLog = useCallback((text) => {
    setLogs(prev => [{ id: Date.now() + Math.random(), text }, ...prev].slice(0, 8));
  }, []);

  const startGame = useCallback(() => {
    const s1 = createInitialSnake(3, Math.floor(GRID_SIZE / 2), INITIAL_SNAKE_LENGTH, 'RIGHT');
    setSnake1(s1);
    setDir1('RIGHT');
    setScore1(0);
    setScore2(0);
    setWinner(null);
    setActiveEffects({ p1: null, p2: null });
    setLogs([{ id: 1, text: 'Game started!' }]);

    if (mode === 'ai' || mode === 'pvp') {
      const s2 = createInitialSnake(GRID_SIZE - 4, Math.floor(GRID_SIZE / 2), INITIAL_SNAKE_LENGTH, 'LEFT');
      setSnake2(s2);
      setDir2('LEFT');
    } else {
      setSnake2([]);
    }

    const allCells = [...s1];
    if (mode !== 'solo') allCells.push(...createInitialSnake(GRID_SIZE - 4, Math.floor(GRID_SIZE / 2), INITIAL_SNAKE_LENGTH, 'LEFT'));
    setFood(spawnFood(allCells));
    setGameState('playing');
  }, [mode, addLog]);

  const changeDirection = useCallback((player, newDir) => {
    if (player === 1) {
      if (OPPOSITE[newDir] !== dir1Ref.current) setDir1(newDir);
    } else {
      if (OPPOSITE[newDir] !== dir2Ref.current) setDir2(newDir);
    }
  }, []);

  // Main game tick
  useEffect(() => {
    if (gameState !== 'playing') return;

    const speed = TICK_SPEEDS[tickSpeed] || TICK_SPEEDS.normal;

    const interval = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;

      // Move snake 1
      const currentSnake1 = [...snake1Ref.current];
      if (currentSnake1.length === 0) return; // Wait for initialization

      const currentDir1 = DIRECTIONS[dir1Ref.current];
      const newHead1 = {
        x: currentSnake1[0].x + currentDir1.x,
        y: currentSnake1[0].y + currentDir1.y,
      };

      // Check P1 collisions
      let p1Dead = false;
      if (checkWallCollision(newHead1)) p1Dead = true;
      if (checkSelfCollision(newHead1, currentSnake1)) p1Dead = true;

      // Move snake 2 (AI or PvP)
      let p2Dead = false;
      let currentSnake2 = [...snake2Ref.current];
      let newHead2 = null;

      if (currentSnake2.length > 0) {
        const currentDir2 = DIRECTIONS[dir2Ref.current];
        newHead2 = {
          x: currentSnake2[0].x + currentDir2.x,
          y: currentSnake2[0].y + currentDir2.y,
        };
        if (checkWallCollision(newHead2)) p2Dead = true;
        if (checkSelfCollision(newHead2, currentSnake2)) p2Dead = true;

        // Cross-collision: P1 head hits P2 body
        if (!p1Dead && currentSnake2.some(seg => seg.x === newHead1.x && seg.y === newHead1.y)) {
          if (effectsRef.current.p1 !== 'shield') p1Dead = true;
          else setActiveEffects(prev => ({ ...prev, p1: null }));
        }
        // Cross-collision: P2 head hits P1 body
        if (!p2Dead && currentSnake1.some(seg => seg.x === newHead2.x && seg.y === newHead2.y)) {
          if (effectsRef.current.p2 !== 'shield') p2Dead = true;
          else setActiveEffects(prev => ({ ...prev, p2: null }));
        }
        // Head-to-head
        if (newHead1.x === newHead2.x && newHead1.y === newHead2.y) {
          p1Dead = true;
          p2Dead = true;
        }
      }

      // Resolve deaths
      if (p1Dead && p2Dead) {
        setWinner('draw');
        setGameState('gameover');
        addLog('💀 Both snakes collided! Draw!');
        return;
      }
      if (p1Dead) {
        setWinner(mode === 'solo' ? 'gameover' : 'p2');
        setGameState('gameover');
        addLog('💀 Player 1 crashed!');
        return;
      }
      if (p2Dead && currentSnake2.length > 0) {
        setWinner('p1');
        setGameState('gameover');
        addLog('💀 Player 2 crashed!');
        return;
      }

      // Apply movement
      const newSnake1 = [newHead1, ...currentSnake1];
      let newSnake2 = currentSnake2.length > 0 ? [newHead2, ...currentSnake2] : [];
      let currentFood = foodRef.current;
      let newScore1 = 0;
      let newScore2 = 0;

      // P1 eats food
      if (currentFood && newHead1.x === currentFood.x && newHead1.y === currentFood.y) {
        const ft = FOOD_TYPES[currentFood.type];
        newScore1 = ft.points;
        for (let i = 0; i < ft.growth; i++) newSnake1.push({ ...newSnake1[newSnake1.length - 1] });
        if (ft.effect === 'shield') setActiveEffects(prev => ({ ...prev, p1: 'shield' }));
        addLog(`🍎 P1 ate ${ft.emoji} (+${ft.points})`);
        currentFood = null;
      } else {
        newSnake1.pop();
      }

      // P2 eats food
      if (currentFood && newHead2 && newHead2.x === currentFood.x && newHead2.y === currentFood.y) {
        const ft = FOOD_TYPES[currentFood.type];
        newScore2 = ft.points;
        for (let i = 0; i < ft.growth; i++) newSnake2.push({ ...newSnake2[newSnake2.length - 1] });
        if (ft.effect === 'shield') setActiveEffects(prev => ({ ...prev, p2: 'shield' }));
        addLog(`🍎 P2 ate ${ft.emoji} (+${ft.points})`);
        currentFood = null;
      } else if (newSnake2.length > 0) {
        newSnake2.pop();
      }

      setSnake1(newSnake1);
      setSnake2(newSnake2);
      if (newScore1) setScore1(prev => prev + newScore1);
      if (newScore2) setScore2(prev => prev + newScore2);

      // Respawn food if eaten
      if (!currentFood) {
        const allCells = [...newSnake1, ...newSnake2];
        setFood(spawnFood(allCells));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, tickSpeed, addLog]);

  return {
    gameState, snake1, snake2, dir1, dir2, food, score1, score2,
    winner, activeEffects, logs,
    startGame, changeDirection, setGameState,
    setDir2, // exposed for AI hook
  };
}

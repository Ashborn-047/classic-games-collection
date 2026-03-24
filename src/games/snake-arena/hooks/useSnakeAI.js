import { useEffect, useRef } from 'react';
import { GRID_SIZE, DIRECTIONS, OPPOSITE } from '../config/gameConfig';

// BFS pathfinding to a target on the grid
function bfs(start, target, obstacles) {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const queue = [{ ...start, path: [] }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const current = queue.shift();
    if (current.x === target.x && current.y === target.y) {
      return current.path;
    }

    for (const [dirName, delta] of Object.entries(DIRECTIONS)) {
      const nx = current.x + delta.x;
      const ny = current.y + delta.y;
      const key = `${nx},${ny}`;

      if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !visited.has(key) && !obstacleSet.has(key)) {
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...current.path, dirName] });
      }
    }
  }
  return null; // No path found
}

function getRandomSafeDirection(head, currentDir, obstacles) {
  const obstacleSet = new Set(obstacles.map(o => `${o.x},${o.y}`));
  const dirs = Object.entries(DIRECTIONS).filter(([name]) => name !== OPPOSITE[currentDir]);

  // Shuffle
  for (let i = dirs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }

  for (const [name, delta] of dirs) {
    const nx = head.x + delta.x;
    const ny = head.y + delta.y;
    if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && !obstacleSet.has(`${nx},${ny}`)) {
      return name;
    }
  }
  return currentDir; // No safe direction — will crash
}

export function useSnakeAI(difficulty, snake2, snake1, food, dir2, setDir2, gameState) {
  const tickRef = useRef(0);

  useEffect(() => {
    if (gameState !== 'playing' || snake2.length === 0) return;

    const interval = setInterval(() => {
      tickRef.current++;
      const head = snake2[0];
      const allObstacles = [...snake2.slice(1), ...snake1];

      if (difficulty === 'chill') {
        // Random movement, avoids walls and self, reconsiders every few ticks
        if (tickRef.current % 3 === 0 || Math.random() > 0.7) {
          const newDir = getRandomSafeDirection(head, dir2, allObstacles);
          setDir2(newDir);
        }
      } else if (difficulty === 'smart') {
        // BFS toward food
        if (food) {
          const path = bfs(head, food, allObstacles);
          if (path && path.length > 0) {
            setDir2(path[0]);
          } else {
            setDir2(getRandomSafeDirection(head, dir2, allObstacles));
          }
        }
      } else if (difficulty === 'ruthless') {
        // BFS toward food, but if close to player try to cut them off
        const playerHead = snake1[0];
        const distToPlayer = Math.abs(head.x - playerHead.x) + Math.abs(head.y - playerHead.y);

        if (distToPlayer < 6 && Math.random() > 0.4) {
          // Try to cut off the player by moving in front of them
          const playerDir = DIRECTIONS[Object.entries(DIRECTIONS).find(([, d]) =>
            snake1.length > 1 && snake1[0].x - snake1[1].x === d.x && snake1[0].y - snake1[1].y === d.y
          )?.[0] || 'RIGHT'];
          const cutoffTarget = { x: playerHead.x + playerDir.x * 2, y: playerHead.y + playerDir.y * 2 };
          const path = bfs(head, cutoffTarget, allObstacles);
          if (path && path.length > 0) {
            setDir2(path[0]);
            return;
          }
        }

        // Fallback to food targeting
        if (food) {
          const path = bfs(head, food, allObstacles);
          if (path && path.length > 0) {
            setDir2(path[0]);
          } else {
            setDir2(getRandomSafeDirection(head, dir2, allObstacles));
          }
        }
      }
    }, 140);

    return () => clearInterval(interval);
  }, [gameState, difficulty, snake2, snake1, food, dir2, setDir2]);
}

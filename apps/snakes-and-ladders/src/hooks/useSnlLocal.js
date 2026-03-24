import { useState, useCallback } from 'react';
import { BOARD_SIZE, SNAKES, LADDERS } from '../config/snlConfig';

export function useSnlLocal() {
  const [players, setPlayers] = useState([
    { id: 1, pos: 0, name: 'Player 1', color: '#ef4444' },
    { id: 2, pos: 0, name: 'AI Bot', color: '#3b82f6', isAI: true }
  ]);
  const [turn, setTurn] = useState(0);
  const [lastRoll, setLastRoll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState([{ id: 0, text: 'Game started!' }]);

  const addLog = useCallback((text) => {
    setLogs(prev => [{ id: Date.now(), text }, ...prev].slice(0, 5));
  }, []);

  const movePlayer = useCallback((playerIndex, roll) => {
    setPlayers(prev => {
      const next = [...prev];
      let newPos = next[playerIndex].pos + roll;

      if (newPos > BOARD_SIZE) {
        addLog(`${next[playerIndex].name} needs ${BOARD_SIZE - next[playerIndex].pos} to win.`);
        return prev;
      }

      // Check snakes and ladders
      let type = null;
      if (SNAKES[newPos]) {
        newPos = SNAKES[newPos];
        type = 'snake';
      } else if (LADDERS[newPos]) {
        newPos = LADDERS[newPos];
        type = 'ladder';
      }

      next[playerIndex].pos = newPos;
      
      if (type === 'snake') addLog(`🐍 Oops! ${next[playerIndex].name} hit a snake to ${newPos}.`);
      else if (type === 'ladder') addLog(`🪜 Yay! ${next[playerIndex].name} climbed a ladder to ${newPos}.`);
      else addLog(`${next[playerIndex].name} moved to ${newPos}.`);

      if (newPos === BOARD_SIZE) {
        setWinner(next[playerIndex]);
        addLog(`🏆 ${next[playerIndex].name} WINS!`);
      }

      return next;
    });
  }, [addLog]);

  const rollDice = useCallback(() => {
    if (winner || isRolling) return;

    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setLastRoll(roll);
      setIsRolling(false);
      movePlayer(turn, roll);

      if (!winner) {
        setTurn(prev => (prev + 1) % players.length);
      }
    }, 600);
  }, [turn, players.length, movePlayer, winner, isRolling]);

  return {
    players, turn, lastRoll, isRolling, winner, logs,
    rollDice
  };
}

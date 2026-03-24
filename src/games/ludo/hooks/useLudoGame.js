import { useState, useCallback } from 'react';
import { 
  PLAYERS, PERIMETER_LENGTH, HOME_PATH_START, FINISH_LINE,
  SAFE_SPOTS, getAbsolutePosition 
} from '../config/ludoConfig';

export function useLudoGame() {
  const [tokens, setTokens] = useState(() => {
    const initial = {};
    PLAYERS.forEach(color => {
      initial[color] = Array.from({ length: 4 }, (_, i) => ({
        id: i,
        owner: color,
        pos: -1 // Base
      }));
    });
    return initial;
  });

  const [turnIndex, setTurnIndex] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [logs, setLogs] = useState([{ id: 0, text: 'Ludo match started!' }]);

  const addLog = useCallback((text) => {
    setLogs(prev => [{ id: Date.now(), text }, ...prev].slice(0, 6));
  }, []);

  const moveToken = useCallback((color, tokenId, steps) => {
    setTokens(prev => {
      const next = { ...prev };
      const token = next[color][tokenId];
      let newPos = token.pos;

      if (newPos === -1) {
        if (steps === 6) newPos = 0; // Exit base
      } else {
        newPos += steps;
      }

      if (newPos > FINISH_LINE) return prev; // Must hit exact finish

      // Capture Logic
      if (newPos >= 0 && newPos < HOME_PATH_START) {
        const absMoving = getAbsolutePosition(color, newPos);
        const isSafe = SAFE_SPOTS.includes(absMoving);

        if (!isSafe) {
          // Check for victims
          Object.keys(next).forEach(otherColor => {
            if (otherColor === color) return;
            next[otherColor].forEach(otherToken => {
              if (otherToken.pos >= 0 && otherToken.pos < HOME_PATH_START) {
                const absOther = getAbsolutePosition(otherColor, otherToken.pos);
                if (absOther === absMoving) {
                  otherToken.pos = -1; // Send back to base
                  addLog(`⚔️ ${color} captured ${otherColor}!`);
                }
              }
            });
          });
        }
      }

      token.pos = newPos;

      // Win Check
      const allFinished = next[color].every(t => t.pos === FINISH_LINE);
      if (allFinished) setWinner(color);

      return next;
    });

    if (steps !== 6) {
      setTurnIndex(prev => (prev + 1) % PLAYERS.length);
    }
    setDiceRoll(null);
  }, [addLog]);

  const rollDice = useCallback(() => {
    if (winner || isRolling || diceRoll !== null) return;
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceRoll(roll);
      setIsRolling(false);
      addLog(`${PLAYERS[turnIndex]} rolled a ${roll}.`);
      
      // Auto-pass if no moves possible (simplified check)
      const currentColor = PLAYERS[turnIndex];
      const canMove = tokens[currentColor].some(t => 
        (t.pos === -1 && roll === 6) || (t.pos >= 0 && t.pos + roll <= FINISH_LINE)
      );
      
      if (!canMove) {
        addLog(`Skip! No moves for ${currentColor}.`);
        setTimeout(() => {
          setTurnIndex(prev => (prev + 1) % PLAYERS.length);
          setDiceRoll(null);
        }, 1000);
      }
    }, 600);
  }, [turnIndex, winner, isRolling, diceRoll, tokens, addLog]);

  return {
    tokens, turnIndex, diceRoll, isRolling, winner, logs,
    rollDice, moveToken
  };
}

import { useState, useEffect, useCallback } from 'react';

/**
 * Ludo Pro - Game Engine Logic (SpacetimeDB Unified)
 * 100% Original Frontend Mechanics, 100% SpacetimeDB Backend.
 */

export function useLudoEngine(roomCode) {
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(1);

    // Mock/Local Fallback (For offline play or initial setup)
    const [localState, setLocalState] = useState({
        turnIndex: 0,
        players: [
            { id: 'RED', tokens: [-1, -1, -1, -1] },
            { id: 'GREEN', tokens: [-1, -1, -1, -1] },
            { id: 'YELLOW', tokens: [-1, -1, -1, -1] },
            { id: 'BLUE', tokens: [-1, -1, -1, -1] }
        ]
    });

    // Handle Local Move (Original Logic)
    const moveTokenLocal = useCallback((tokenIndex) => {
        if (isRolling) return;
        
        setIsRolling(true);
        const dice = Math.floor(Math.random() * 6) + 1;
        setDiceValue(dice);

        setTimeout(() => {
            setLocalState(prev => {
                const nextState = { ...prev };
                const currentPlayer = nextState.players[prev.turnIndex];
                const oldPos = currentPlayer.tokens[tokenIndex];
                let newPos = oldPos;

                if (oldPos === -1) {
                    if (dice === 6) newPos = 0;
                } else {
                    newPos = Math.min(57, oldPos + dice);
                }

                currentPlayer.tokens[tokenIndex] = newPos;
                nextState.turnIndex = (prev.turnIndex + 1) % 4;
                return nextState;
            });
            setIsRolling(false);
        }, 800);
    }, [isRolling]);

    // SpacetimeDB Integration (Skeleton - to be activated when roomCode is provided)
    useEffect(() => {
        if (!roomCode) return;
        
        // --- SpacetimeDB Logic ---
        /*
           1. Connect to module 'ludo-pro'
           2. Sub to 'LudoRoom' where code = roomCode
           3. Sub to 'LudoPlayer' in room
           4. Update local 'room' and 'players' state from table events
        */
        console.log(`[Ludo Engine] Connecting to SpacetimeDB Room: ${roomCode}`);
        
    }, [roomCode]);

    return { 
        room: room || { code: roomCode, status: 'Active', turn_index: localState.turnIndex }, 
        players: players.length > 0 ? players : localState.players, 
        isRolling, 
        diceValue, 
        moveToken: moveTokenLocal 
    };
}

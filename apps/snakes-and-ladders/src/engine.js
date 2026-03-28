import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Snakes & Ladders - Game Engine Logic
 * Supports both Local (Mock) and Real SpacetimeDB backends.
 */

// --- MOCK ENGINE (LOCAL) ---
export function useMockSpacetimeEngine() {
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isRolling, setIsRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(1);

    const createRoom = useCallback((roomName) => {
        const newRoom = { 
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            name: roomName,
            status: 'Lobby',
            host: 'local-user',
            turn_index: 0
        };
        setRoom(newRoom);
        setPlayers([{ 
            identity: 'local-user', 
            name: 'You', 
            color: 'RED', 
            position: 0 
        }]);
        return newRoom.code;
    }, []);

    const joinRoom = useCallback((code) => {
        setRoom({ code, name: 'Remote Room', status: 'Lobby', host: 'other-user', turn_index: 0 });
        setPlayers([
            { identity: 'other-user', name: 'Host', color: 'RED', position: 0 },
            { identity: 'local-user', name: 'You', color: 'BLUE', position: 0 }
        ]);
    }, []);

    const moveToken = useCallback((code, dice) => {
        setIsRolling(true);
        setTimeout(() => {
            setDiceValue(dice);
            setIsRolling(false);
            setPlayers(prev => prev.map((p, idx) => {
                if (idx === room.turn_index) {
                    const newPos = Math.min(100, p.position + dice);
                    return { ...p, position: newPos };
                }
                return p;
            }));
            setRoom(prev => ({ ...prev, turn_index: (prev.turn_index + 1) % players.length }));
        }, 1000);
    }, [room, players.length]);

    return { room, players, logs, isRolling, diceValue, createRoom, joinRoom, moveToken };
}

// --- REAL SPACETIMEDB ENGINE ---
/* 
   To use this, uncomment the SDK imports in App.jsx and swap useMockSpacetimeEngine 
   with useRealSpacetimeEngine.
*/
export function useRealSpacetimeEngine() {
    // Placeholder for actual SpacetimeDB SDK integration
    // This will be populated as the user grows into the unified backend.
    return useMockSpacetimeEngine(); 
}

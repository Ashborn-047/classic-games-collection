import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { initSnakeEngine } from './engine';

export default function App({ onExit }) {
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const [highScore, setHighScore] = useState(localStorage.getItem('snakeHighScore') || 0);
    const [isHomeScreen, setIsHomeScreen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Refs for UI elements that the engine directly manipulates (to keep original logic)
    const scoreEl = useRef(null);
    const highScoreEl = useRef(null);
    const finalScoreEl = useRef(null);
    const gameOverScreen = useRef(null);
    const pauseScreen = useRef(null);
    const settingsScreen = useRef(null);
    const homeScreen = useRef(null);
    const homeHighScoreEl = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            engineRef.current = initSnakeEngine({
                canvas: canvasRef.current,
                ctx,
                scoreEl: scoreEl.current,
                highScoreEl: highScoreEl.current,
                finalScoreEl: finalScoreEl.current,
                gameOverScreen: gameOverScreen.current,
                pauseScreen: pauseScreen.current,
                settingsScreen: settingsScreen.current,
                homeScreen: homeScreen.current,
                homeHighScore: homeHighScoreEl.current
            });

            // Keyboard Listeners
            const handleKeyDown = (e) => {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                    e.preventDefault();
                }

                const status = engineRef.current.getStatus();
                if (!status.isPlaying) {
                    if ((e.key === ' ' || e.key === 'Enter') && !isSettingsOpen) {
                        handlePlay();
                    }
                    return;
                }

                if (e.key.toLowerCase() === 'p') {
                    engineRef.current.togglePause();
                    return;
                }

                if (status.isPaused) return;

                switch(e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W': engineRef.current.changeDirection(0, -1); break;
                    case 'ArrowDown':
                    case 's':
                    case 'S': engineRef.current.changeDirection(0, 1); break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A': engineRef.current.changeDirection(-1, 0); break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D': engineRef.current.changeDirection(1, 0); break;
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('resize', engineRef.current.resize);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('resize', engineRef.current.resize);
            };
        }
    }, [isSettingsOpen]);

    const handlePlay = () => {
        setIsHomeScreen(false);
        engineRef.current.initGame();
    };

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    const handleApplySettings = () => {
        const theme = document.getElementById('themeSelect').value;
        const skin = document.getElementById('snakeSelect').value;
        const food = document.getElementById('foodSelect').value;
        
        localStorage.setItem('snakeTheme', theme);
        localStorage.setItem('snakeSkin', skin);
        localStorage.setItem('snakeFood', food);
        
        engineRef.current.applyTheme();
        setIsSettingsOpen(false);
    };

    const handleGoHome = () => {
        setIsHomeScreen(true);
        const currentHS = localStorage.getItem('snakeHighScore') || 0;
        setHighScore(currentHS);
        engineRef.current.getStatus().isPlaying = false; // Force stop
        gameOverScreen.current.classList.add('hidden');
    };

    return (
        <div className="bg-gray-950 text-green-400 h-screen w-screen overflow-hidden font-mono selection:bg-green-900 selection:text-green-100 transition-colors duration-500 relative">
            
            {/* Game Canvas */}
            <canvas ref={canvasRef} id="gameCanvas" className="fixed inset-0 w-full h-full z-0 block"></canvas>

            {/* Header / Scoreboard */}
            <div className="fixed top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-10 pointer-events-none">
                <div className="pointer-events-auto drop-shadow-md">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600 tracking-widest drop-shadow-sm">SNAKE</h1>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Swipe or Arrow Keys</p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-center pointer-events-auto drop-shadow-md">
                    <div className="bg-gray-900/90 border border-gray-800 rounded-lg px-2 sm:px-3 py-1.5 flex flex-col items-center shadow-inner backdrop-blur-sm">
                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">HIGH SCORE</span>
                        <span ref={highScoreEl} id="highScore" className="text-white font-bold text-base sm:text-lg leading-none mt-1">{highScore}</span>
                    </div>
                    <div className="bg-gray-900/90 border border-green-900/50 rounded-lg px-2 sm:px-3 py-1.5 flex flex-col items-center shadow-inner relative overflow-hidden min-w-[4rem] sm:min-w-[5rem] backdrop-blur-sm">
                        <div className="absolute inset-0 bg-green-500/10"></div>
                        <span className="text-[10px] text-green-400 font-bold tracking-wider relative z-10">SCORE</span>
                        <span ref={scoreEl} id="score" className="text-white font-bold text-base sm:text-lg leading-none mt-1 relative z-10">0</span>
                    </div>
                </div>
            </div>

            {/* Game Over Screen */}
            <div ref={gameOverScreen} id="gameOverScreen" className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center z-30 hidden transition-opacity">
                <div className="bg-gray-900/95 border-2 border-red-800/50 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-pop w-5/6 max-w-sm text-center">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600 mb-2 drop-shadow-sm">GAME OVER</h2>
                    <div className="bg-gray-800/50 rounded-lg w-full py-4 text-center mb-6 border border-gray-700/50 shadow-inner">
                        <p className="text-gray-400 text-[10px] font-bold tracking-widest mb-1 uppercase">Final Score</p>
                        <p ref={finalScoreEl} id="finalScore" className="text-4xl text-white font-black leading-none">0</p>
                    </div>
                    <div className="flex gap-3 w-full mb-5">
                        <button onClick={handlePlay} className="flex-1 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-3 px-2 rounded-xl border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all shadow-lg uppercase tracking-wider text-sm">
                            Play Again
                        </button>
                        <button onClick={handleGoHome} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition-all shadow-lg uppercase tracking-wider text-sm flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pause Screen */}
            <div ref={pauseScreen} id="pauseScreen" className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-30 hidden transition-opacity cursor-pointer">
                <div className="bg-gray-900/95 border-2 border-yellow-700/50 p-10 rounded-2xl shadow-2xl flex flex-col items-center animate-pop">
                    <svg className="w-12 h-12 text-yellow-500 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    <h2 className="text-3xl font-black text-yellow-500 mb-2 tracking-widest drop-shadow-sm">PAUSED</h2>
                    <p className="text-gray-400 text-sm font-medium">Click or Arrow Key to resume</p>
                </div>
            </div>

            {/* Home Screen */}
            <div ref={homeScreen} id="homeScreen" className={`fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-500 overflow-y-auto py-8 ${isHomeScreen ? '' : 'hidden'}`}>
                <div className="animate-pop flex flex-col items-center text-center my-auto">
                    <div className="relative w-28 h-28 mb-8 shadow-2xl rounded-3xl bg-gray-900 border-2 border-gray-800 flex items-center justify-center p-5 transform rotate-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-3xl"></div>
                        <div className="w-full h-full grid grid-cols-4 grid-rows-4 gap-1.5 relative z-10">
                            {[1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0].map((v, i) => v ? <div key={i} className="bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div> : <div key={i}></div>)}
                        </div>
                    </div>
                    
                    <h1 className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600 tracking-widest drop-shadow-2xl mb-5">SNAKE</h1>
                    
                    <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl px-6 py-2.5 mb-10 shadow-inner backdrop-blur-sm">
                        <p className="text-gray-400 text-xs font-bold tracking-widest uppercase">High Score <span ref={homeHighScoreEl} className="text-white text-lg ml-3">{highScore}</span></p>
                    </div>

                    <button onClick={handlePlay} className="w-64 bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-4 px-8 rounded-2xl border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all mb-6 shadow-2xl uppercase tracking-widest text-xl flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        Play Game
                    </button>
                    
                    <button onClick={toggleSettings} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors py-2 px-4 rounded-lg hover:bg-white/5">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Customize
                    </button>
                    <button onClick={onExit} className="mt-4 text-gray-500 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-all">
                        Exit to Hub
                    </button>
                </div>
            </div>

            {/* Settings Screen */}
            <div ref={settingsScreen} id="settingsScreen" className={`fixed inset-0 bg-gray-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-opacity ${isSettingsOpen ? '' : 'hidden'}`}>
                <div className="bg-gray-900 border-2 border-gray-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-pop w-11/12 max-w-sm">
                    <div className="w-full flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white tracking-wider drop-shadow-sm">CUSTOMIZE</h2>
                        <button onClick={toggleSettings} className="text-gray-500 hover:text-white transition-colors p-1 bg-gray-800 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <div className="w-full space-y-5 text-left text-sm">
                        <div className="group">
                            <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-green-400 transition-colors">Board Theme</label>
                            <select id="themeSelect" className="w-full bg-gray-800 text-white font-medium p-3 rounded-lg border border-gray-700 cursor-pointer shadow-inner">
                                <option value="classic">Classic Dark</option>
                                <option value="neon">Cyberpunk Neon</option>
                                <option value="matrix">Matrix Green</option>
                                <option value="light">Gameboy Light</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-green-400 transition-colors">Snake Skin</label>
                            <select id="snakeSelect" className="w-full bg-gray-800 text-white font-medium p-3 rounded-lg border border-gray-700 cursor-pointer shadow-inner">
                                <option value="green">Classic Green</option>
                                <option value="blue">Ocean Blue</option>
                                <option value="purple">Royal Purple</option>
                                <option value="ghost">Ghost White</option>
                            </select>
                        </div>
                        <div className="group">
                            <label className="block text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1.5 group-hover:text-green-400 transition-colors">Food Type</label>
                            <select id="foodSelect" className="w-full bg-gray-800 text-white font-medium p-3 rounded-lg border border-gray-700 cursor-pointer shadow-inner">
                                <option value="apple">Red Apple (Circle)</option>
                                <option value="gem">Amethyst Gem (Diamond)</option>
                                <option value="gold">Gold Coin (Square)</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleApplySettings} className="w-full mt-8 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wider shadow-lg">
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

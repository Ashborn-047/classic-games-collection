/**
 * Snake Eating - Original Gameplay Engine
 * 100% Original logic from USER source.
 */

export function initSnakeEngine(elements) {
    const { canvas, ctx, scoreEl, highScoreEl, finalScoreEl, gameOverScreen, pauseScreen, settingsScreen, homeScreen, homeHighScore } = elements;
    
    // Customization Data
    const THEMES = {
        classic: { bg: '#111827', grid: '#1f2937', shadow: '0 0 15px rgba(74, 222, 128, 0.3)', border: '#1f2937' },
        neon: { bg: '#09090b', grid: '#27272a', shadow: '0 0 20px rgba(236, 72, 153, 0.4)', border: '#831843' },
        matrix: { bg: '#000000', grid: '#064e3b', shadow: '0 0 20px rgba(16, 185, 129, 0.5)', border: '#065f46' },
        light: { bg: '#d1d5db', grid: '#9ca3af', shadow: '0 0 15px rgba(0, 0, 0, 0.2)', border: '#9ca3af' }
    };
    const SNAKE_SKINS = {
        green: { head: '#4ade80', body: '#22c55e', eye: '#064e3b' },
        blue: { head: '#60a5fa', body: '#3b82f6', eye: '#1e3a8a' },
        purple: { head: '#c084fc', body: '#a855f7', eye: '#4c1d95' },
        ghost: { head: '#f8fafc', body: '#cbd5e1', eye: '#0f172a' }
    };
    const FOOD_SKINS = {
        apple: { color: '#ef4444', shape: 'circle' },
        gem: { color: '#a855f7', shape: 'diamond' },
        gold: { color: '#fbbf24', shape: 'square' }
    };

    // Load saved preferences or set defaults
    let activeTheme = localStorage.getItem('snakeTheme') || 'classic';
    let activeSnake = localStorage.getItem('snakeSkin') || 'green';
    let activeFood = localStorage.getItem('snakeFood') || 'apple';

    // Game Configuration
    const gridSize = 30; // Size of each tile in pixels
    const baseSpeed = 120; // Initial speed in ms (lower is faster)
    const speedMultiplier = 0.98; // How much faster it gets per food
    
    // Dynamic Grid Values
    let columns = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;

    // Game State Variables
    let snake = [];
    let food = { x: 0, y: 0 };
    let dx = 0; // Direction X
    let dy = 0; // Direction Y
    let nextDx = 0; // Buffered direction to prevent 180-degree turns in one frame
    let nextDy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let isPlaying = false;
    let isPaused = false;
    let gameLoopId;
    let currentSpeed;

    // Audio & Particles
    let audioCtx;
    let particles = [];

    // Sound Engine
    function playSound(type) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        if (type === 'eat') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start(); osc.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'die') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(); osc.stop(audioCtx.currentTime + 0.3);
        }
    }

    // Particle System
    function spawnParticles(x, y, color) {
        for(let i=0; i<12; i++) {
            particles.push({
                x: x * gridSize + gridSize/2,
                y: y * gridSize + gridSize/2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1,
                color: color
            });
        }
    }

    function drawAndUpdateParticles() {
        for(let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx; 
            p.y += p.vy;
            p.life -= 0.05;
            
            if(p.life <= 0) { 
                particles.splice(i, 1); 
                continue; 
            }
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    // Handle Dynamic Resizing
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(canvas.width / gridSize);
        rows = Math.floor(canvas.height / gridSize);
        offsetX = (canvas.width - columns * gridSize) / 2;
        offsetY = (canvas.height - rows * gridSize) / 2;
    }

    function applyThemeSettings() {
        if (!canvas) return;
        activeTheme = localStorage.getItem('snakeTheme') || 'classic';
        activeSnake = localStorage.getItem('snakeSkin') || 'green';
        activeFood = localStorage.getItem('snakeFood') || 'apple';
        
        canvas.style.backgroundColor = THEMES[activeTheme].bg;
        // The App.jsx handles body class names to avoid React conflicts
    }

    function draw() {
        if (!ctx) return;
        ctx.fillStyle = THEMES[activeTheme].bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offsetX, offsetY);

        ctx.strokeStyle = THEMES[activeTheme].border || THEMES[activeTheme].grid;
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, columns * gridSize, rows * gridSize);

        ctx.strokeStyle = THEMES[activeTheme].grid;
        ctx.lineWidth = 1;
        for(let i = 0; i <= columns * gridSize; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, rows * gridSize); ctx.stroke();
        }
        for(let i = 0; i <= rows * gridSize; i += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(columns * gridSize, i); ctx.stroke();
        }

        const foodStyle = FOOD_SKINS[activeFood];
        ctx.shadowBlur = 15;
        ctx.shadowColor = foodStyle.color;
        ctx.fillStyle = foodStyle.color;
        
        ctx.beginPath();
        const fx = food.x * gridSize + gridSize/2;
        const fy = food.y * gridSize + gridSize/2;
        const fSize = gridSize/2 - 3;

        if (foodStyle.shape === 'circle') {
            ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
        } else if (foodStyle.shape === 'square') {
            ctx.roundRect(food.x * gridSize + 3, food.y * gridSize + 3, gridSize - 6, gridSize - 6, 3);
        } else if (foodStyle.shape === 'diamond') {
            ctx.moveTo(fx, fy - fSize - 1);
            ctx.lineTo(fx + fSize + 1, fy);
            ctx.lineTo(fx, fy + fSize + 1);
            ctx.lineTo(fx - fSize - 1, fy);
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        const snakeStyle = SNAKE_SKINS[activeSnake];
        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? snakeStyle.head : snakeStyle.body;
            ctx.beginPath();
            ctx.roundRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4, 6);
            ctx.fill();
        });
        
        if (snake.length > 0) {
            drawEyes(snake[0].x, snake[0].y, dx, dy, snakeStyle.eye);
        }

        drawAndUpdateParticles();
        ctx.restore();
    }

    function drawEyes(x, y, dx, dy, eyeColor) {
        ctx.fillStyle = eyeColor || '#064e3b';
        const size = 4.5;
        const px = x * gridSize;
        const py = y * gridSize;
        
        if (dx === 1) { // Right
            ctx.fillRect(px + 18, py + 6, size, size);
            ctx.fillRect(px + 18, py + 18, size, size);
        } else if (dx === -1) { // Left
            ctx.fillRect(px + 6, py + 6, size, size);
            ctx.fillRect(px + 6, py + 18, size, size);
        } else if (dy === -1) { // Up
            ctx.fillRect(px + 6, py + 6, size, size);
            ctx.fillRect(px + 18, py + 6, size, size);
        } else if (dy === 1) { // Down
            ctx.fillRect(px + 6, py + 18, size, size);
            ctx.fillRect(px + 18, py + 18, size, size);
        }
    }

    function placeFood() {
        let validPosition = false;
        while (!validPosition) {
            food.x = Math.floor(Math.random() * columns);
            food.y = Math.floor(Math.random() * rows);
            validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
        }
    }

    function update() {
        dx = nextDx;
        dy = nextDy;
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            playSound('die');
            return handleGameOver();
        }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            playSound('eat');
            spawnParticles(food.x, food.y, FOOD_SKINS[activeFood].color);
            score += 10;
            scoreEl.textContent = score;
            currentSpeed = Math.max(50, currentSpeed * speedMultiplier);
            placeFood();
        } else {
            snake.pop();
        }
    }

    function gameLoop() {
        if (!isPlaying || isPaused) return;
        update();
        draw();
        if (isPlaying && !isPaused) {
            gameLoopId = setTimeout(gameLoop, currentSpeed);
        }
    }

    function handleGameOver() {
        isPlaying = false;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            highScoreEl.textContent = highScore;
            if (homeHighScore) homeHighScore.textContent = highScore;
        }
        finalScoreEl.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    function changeDirection(newDx, newDy) {
        if (dx === 0 && newDy === -dy) return; 
        if (dy === 0 && newDx === -dx) return;
        nextDx = newDx;
        nextDy = newDy;
    }

    // Exported Methods
    const engine = {
        initGame: () => {
            resizeCanvas();
            const startX = Math.floor(columns / 2);
            const startY = Math.floor(rows / 2);
            snake = [{ x: startX, y: startY }, { x: startX - 1, y: startY }, { x: startX - 2, y: startY }];
            dx = 1; dy = 0; nextDx = 1; nextDy = 0;
            score = 0; currentSpeed = baseSpeed;
            scoreEl.textContent = score;
            particles = [];
            placeFood();
            isPlaying = true;
            isPaused = false;
            homeScreen.classList.add('hidden');
            gameOverScreen.classList.add('hidden');
            pauseScreen.classList.add('hidden');
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            if (gameLoopId) clearTimeout(gameLoopId);
            gameLoop();
        },
        togglePause: () => {
            if (!isPlaying) return;
            isPaused = !isPaused;
            if (isPaused) {
                pauseScreen.classList.remove('hidden');
                if (gameLoopId) clearTimeout(gameLoopId);
            } else {
                pauseScreen.classList.add('hidden');
                gameLoop();
            }
        },
        changeDirection,
        resize: () => {
            resizeCanvas();
            if (!isPlaying) draw();
        },
        applyTheme: applyThemeSettings,
        getStatus: () => ({ isPlaying, isPaused })
    };

    // Initial setup
    resizeCanvas();
    applyThemeSettings();
    
    return engine;
}

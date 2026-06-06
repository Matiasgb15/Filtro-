// ========== CONFIGURACIÓN ==========
const LEVELS = [
    { name: 'PRINCIPIANTE', ballSpeed: 3, paddleSpeed: 4, minScore: 5 },
    { name: 'INTERMEDIO', ballSpeed: 5, paddleSpeed: 6, minScore: 8 },
    { name: 'EXPERTO', ballSpeed: 7, paddleSpeed: 8, minScore: 10 }
];

// ========== VARIABLES GLOBALES ==========
let canvas, ctx;
let gameState = 'menu'; // menu, playing, gameOver
let currentLevel = 0;
let playerScore = 0;
let aiScore = 0;
let gameRunning = false;

// Objetos del juego
let ball = null;
let player = null;
let ai = null;

// Input
let mouseY = 0;

// Audio
const sounds = {};

// Images
const images = {
    pelota: null,
    jugador: null,
    maquina: null
};

// ========== CLASES ==========
class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 15;
        this.height = 15;
        
        const level = LEVELS[currentLevel];
        const speed = level.ballSpeed;
        const angle = (Math.random() - 0.5) * Math.PI / 3;
        
        this.vx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = speed * Math.sin(angle);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Rebote en muros superior/inferior
        if (this.y - this.height / 2 < 0 || this.y + this.height / 2 > canvas.height) {
            this.vy *= -1;
            this.y = Math.max(this.height / 2, Math.min(canvas.height - this.height / 2, this.y));
        }
    }
    
    draw() {
        // Dibujar pelota
        if (images.pelota && images.pelota.complete) {
            ctx.drawImage(images.pelota, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            // Fallback: círculo amarillo
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
    
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        
        const level = LEVELS[currentLevel];
        const speed = level.ballSpeed;
        const angle = (Math.random() - 0.5) * Math.PI / 3;
        
        this.vx = speed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1);
        this.vy = speed * Math.sin(angle);
    }
}

class Paddle {
    constructor(x, isPlayer) {
        this.x = x;
        this.y = canvas.height / 2;
        this.width = 60;
        this.height = 120;
        this.isPlayer = isPlayer;
    }
    
    update(targetY) {
        const level = LEVELS[currentLevel];
        const speed = level.paddleSpeed;
        
        if (Math.abs(this.y - targetY) > speed) {
            if (this.y < targetY) {
                this.y += speed;
            } else {
                this.y -= speed;
            }
        } else {
            this.y = targetY;
        }
        
        // Limitar dentro de pantalla
        this.y = Math.max(this.height / 2, Math.min(canvas.height - this.height / 2, this.y));
    }
    
    draw() {
        const image = this.isPlayer ? images.jugador : images.maquina;
        
        if (image && image.complete) {
            // Dibujar asset
            ctx.drawImage(image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            // Fallback: rectángulo coloreado
            ctx.fillStyle = this.isPlayer ? 'rgba(255, 107, 0, 0.9)' : 'rgba(100, 100, 100, 0.9)';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            
            // Texto
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.isPlayer ? 'TÚ' : 'IA', this.x, this.y);
        }
        
        // Dibujar borde de colisión
        ctx.strokeStyle = this.isPlayer ? 'rgba(255, 107, 0, 0.8)' : 'rgba(100, 100, 100, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    
    collidesWith(ballX, ballY, ballWidth, ballHeight) {
        return (
            ballX + ballWidth / 2 > this.x - this.width / 2 &&
            ballX - ballWidth / 2 < this.x + this.width / 2 &&
            ballY + ballHeight / 2 > this.y - this.height / 2 &&
            ballY - ballHeight / 2 < this.y + this.height / 2
        );
    }
}

// ========== INICIALIZACIÓN ==========
window.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    setupEventListeners();
    loadAssets();
    loadSounds();
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function setupEventListeners() {
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('restartBtn').addEventListener('click', backToMenu);
    document.addEventListener('mousemove', (e) => {
        mouseY = e.clientY;
    });
}

function loadAssets() {
    // Precargar imágenes
    images.pelota = new Image();
    images.pelota.src = 'Assets/pelota tenis.png';
    
    images.jugador = new Image();
    images.jugador.src = 'Assets/JUGADOR.png';
    
    images.maquina = new Image();
    images.maquina.src = 'Assets/maquina.png';
    
    console.log('📦 Assets precargados');
}

function loadSounds() {
    // Precargar sonidos (intentar, pero no fallar si no están disponibles)
    try {
        sounds.golpe = new Audio('Assets/golpe pelota tenis.mp3');
        sounds.punto = new Audio('Assets/sonido victoria de punto.mp3');
        sounds.gameOver = new Audio('Assets/game over.mp3');
    } catch (e) {
        console.log('Sonidos no disponibles:', e);
    }
}

function playSound(soundName) {
    if (sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play().catch(() => {});
    }
}

// ========== PANTALLAS ==========
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });
    
    const screen = document.getElementById(screenName);
    if (screen) {
        screen.classList.remove('hidden');
        screen.classList.add('active');
    }
}

function startGame() {
    gameState = 'playing';
    currentLevel = 0;
    playerScore = 0;
    aiScore = 0;
    startLevel();
}

function startLevel() {
    gameRunning = true;
    
    ball = new Ball();
    player = new Paddle(40, true);
    ai = new Paddle(canvas.width - 40, false);
    
    document.getElementById('levelText').textContent = LEVELS[currentLevel].name;
    document.getElementById('instructions').textContent = 
        `Nivel ${currentLevel + 1}/3 - Alcanza ${LEVELS[currentLevel].minScore} puntos para ganar`;
    
    showScreen('gameScreen');
    gameLoop();
}

function endGame() {
    gameRunning = false;
    gameState = 'gameOver';
    
    const playerWon = playerScore > aiScore;
    const title = playerWon ? '¡VICTORIA!' : 'DERROTA';
    const message = playerWon 
        ? `¡Superaste a la máquina! ${playerScore} vs ${aiScore}`
        : `La máquina te venció: ${aiScore} vs ${playerScore}`;
    
    document.getElementById('gameOverTitle').textContent = title;
    document.getElementById('finalPlayerScore').textContent = playerScore;
    document.getElementById('finalAiScore').textContent = aiScore;
    document.getElementById('finalLevel').textContent = currentLevel + 1;
    document.getElementById('gameOverMessage').textContent = message;
    
    playSound('gameOver');
    showScreen('gameOverScreen');
}

function backToMenu() {
    gameState = 'menu';
    showScreen('menu');
}

// ========== LÓGICA DE JUEGO ==========
function updateGame() {
    if (!gameRunning) return;
    
    // Actualizar posiciones
    ball.update();
    
    // Player controla su pala
    const playerTargetY = Math.min(canvas.height - player.height / 2, 
                                   Math.max(player.height / 2, mouseY));
    player.update(playerTargetY);
    
    // IA sigue la pelota
    ai.update(ball.y);
    
    // Verificar colisión con paletas
    if (player.collidesWith(ball.x, ball.y, ball.width, ball.height) && ball.vx < 0) {
        ball.vx = -ball.vx * 1.05;
        ball.x = player.x + player.width / 2 + ball.width / 2;
        playSound('golpe');
    }
    
    if (ai.collidesWith(ball.x, ball.y, ball.width, ball.height) && ball.vx > 0) {
        ball.vx = -ball.vx * 1.05;
        ball.x = ai.x - ai.width / 2 - ball.width / 2;
        playSound('golpe');
    }
    
    // Verificar puntos
    if (ball.x < 0) {
        aiScore++;
        playSound('punto');
        updateScore();
        checkLevelEnd();
        ball.reset();
    }
    
    if (ball.x > canvas.width) {
        playerScore++;
        playSound('punto');
        updateScore();
        checkLevelEnd();
        ball.reset();
    }
}

function updateScore() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}

function checkLevelEnd() {
    const minScore = LEVELS[currentLevel].minScore;
    
    if (playerScore >= minScore || aiScore >= minScore) {
        endGame();
    }
}

function drawGame() {
    // Limpiar canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar línea central punteada
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Dibujar objetos
    if (ball) ball.draw();
    if (player) player.draw();
    if (ai) ai.draw();
}

function gameLoop() {
    updateGame();
    drawGame();
    
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar bucle de renderizado cuando el canvas esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }, 100);
});

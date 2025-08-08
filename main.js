import Game from './js/Game.js';
import InputHandler from './js/InputHandler.js';
import { NormalPlatform, TrampolinePlatform, BreakablePlatform } from './js/Platform.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const tiltCheckbox = document.getElementById('tilt-checkbox');

canvas.width = 400;
canvas.height = 600;

const game = new Game(canvas, ctx);
const inputHandler = new InputHandler(game.player);

// Prevent default touch behaviors on the canvas to avoid long-press selection/callouts
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
['touchstart', 'touchmove', 'touchend'].forEach((type) => {
    canvas.addEventListener(
        type,
        (e) => {
            e.preventDefault();
        },
        { passive: false }
    );
});

game.setScoreElements(scoreElement, finalScoreElement);
game.setGameOverCallback(() => {
    gameOverScreen.classList.remove('hidden');
});

function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    game.init();

    // Reset tilt controls, then enable if checked
    const shouldEnableTilt = (tiltCheckbox && tiltCheckbox.checked);
    inputHandler.disableTiltControls();
    if (shouldEnableTilt) {
        inputHandler.enableTiltControls({ threshold: 5, maxAngle: 25, exponent: 1.7, alpha: 0.2 }).catch(() => {
            // Ignore errors; fall back to keyboard/touch
        });
    }
    game.start();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

window.onload = () => {
    startScreen.classList.remove('hidden');

    // Render platform legend via platform draw methods
    const canvases = document.querySelectorAll('.legend-canvas');
    canvases.forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        const variant = canvas.dataset.variant;
        const x = 2;
        const y = 2;
        const width = canvas.width - 4;
        const height = canvas.height - 4;

        let platform;
        if (variant === 'trampoline') {
            platform = new TrampolinePlatform(x, y, width, height);
        } else if (variant === 'breakable') {
            platform = new BreakablePlatform(x, y, width, height);
        } else {
            platform = new NormalPlatform(x, y, width, height);
        }
        platform.draw(ctx);
    });
};
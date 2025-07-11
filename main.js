import Game from './js/Game.js';
import InputHandler from './js/InputHandler.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

canvas.width = 400;
canvas.height = 600;

const game = new Game(canvas, ctx);
const inputHandler = new InputHandler(game.player);

game.setScoreElements(scoreElement, finalScoreElement);
game.setGameOverCallback(() => {
    gameOverScreen.classList.remove('hidden');
});

function startGame() {
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    game.init();
    game.start();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

window.onload = () => {
    startScreen.classList.remove('hidden');
};
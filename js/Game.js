import Platform from './Platform.js';
import Player from './Player.js';
import Renderer from './Renderer.js';

export default class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.renderer = new Renderer(canvas, ctx);
        this.player = new Player(canvas);
        
        this.isRunning = false;
        this.score = 0;
        this.gravity = 0.2;
        this.platformCount = 8;
        this.platforms = [];
        this.highestPlatform = 0;
        this.scrollOffset = 0;
        this.minPlatformSpace = 40;
        this.maxPlatformSpace = 120;
        
        this.gameOverCallback = null;
        this.scoreElements = null;
    }

    init() {
        this.score = 0;
        this.platforms = [];
        this.scrollOffset = 0;
        this.highestPlatform = 0;
        this.player.reset();
        this.generateInitialPlatforms();
        this.updateScore();
    }

    generateInitialPlatforms() {
        this.platforms.push(new Platform(
            this.player.x - 35,
            this.player.y + this.player.height + 5,
            80,
            15
        ));

        const spaceBetweenPlatforms = this.canvas.height / this.platformCount;

        for (let i = 1; i < this.platformCount; i++) {
            let x = Math.random() * (this.canvas.width - 90);
            let y = this.canvas.height - (i * spaceBetweenPlatforms) - Math.random() * 20;

            if (i <= 3) {
                let width = 70 + Math.random() * 30;
                this.platforms.push(new Platform(x, y, width, 15));
            } else {
                this.platforms.push(new Platform(x, y));
            }

            if (y < this.highestPlatform || this.highestPlatform === 0) {
                this.highestPlatform = y;
            }
        }
    }

    generateNewPlatform() {
        const gap = Math.random() * (this.maxPlatformSpace - this.minPlatformSpace) + this.minPlatformSpace;
        let x = Math.random() * (this.canvas.width - 70);
        let y = this.highestPlatform - gap;

        if (this.platforms.length > 0) {
            const lastPlatform = this.platforms[this.platforms.length - 1];
            const maxJumpHeight = 180;

            if (lastPlatform.y - y > maxJumpHeight) {
                y = lastPlatform.y - maxJumpHeight + Math.random() * 40;
            }
        }

        this.platforms.push(new Platform(x, y));
        this.highestPlatform = y;
    }

    updateScore() {
        if (this.scoreElements) {
            this.renderer.updateScore(this.score, this.scoreElements.score, this.scoreElements.finalScore);
        }
    }

    setScoreElements(scoreElement, finalScoreElement) {
        this.scoreElements = {
            score: scoreElement,
            finalScore: finalScoreElement
        };
    }

    setGameOverCallback(callback) {
        this.gameOverCallback = callback;
    }

    update() {
        if (!this.isRunning) return;

        this.renderer.clear();
        this.player.update(this.gravity);

        this.platforms.forEach(platform => {
            if (this.player.checkCollision(platform)) {
                this.player.jump();
            }
        });

        if (this.player.y < this.canvas.height / 3 && this.player.velocityY < 0) {
            this.scrollOffset -= this.player.velocityY;

            this.platforms.forEach(platform => {
                platform.y -= this.player.velocityY;
            });

            this.score -= this.player.velocityY / 10;
            this.updateScore();
            this.player.y -= this.player.velocityY;
        }

        this.platforms = this.platforms.filter(platform => platform.y < this.canvas.height + platform.height);

        while (this.platforms.length < this.platformCount) {
            this.generateNewPlatform();
        }

        if (this.player.y > this.canvas.height) {
            this.gameOver();
            return;
        }

        this.renderer.drawPlatforms(this.platforms);
        this.renderer.drawPlayer(this.player);
    }

    gameOver() {
        this.isRunning = false;
        if (this.gameOverCallback) {
            this.gameOverCallback();
        }
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        if (this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}
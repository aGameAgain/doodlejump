import Platform, { NormalPlatform, TrampolinePlatform, BreakablePlatform } from './Platform.js';
import Player from './Player.js';
import Renderer from './Renderer.js';
import PowerUp from './PowerUp.js';

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
        this.powerUps = [];
        this.highestPlatform = 0;
        this.scrollOffset = 0;
        this.minPlatformSpace = 40;
        this.maxPlatformSpace = 120;
        this.platformWidth = 70;
        this.platformHeight = 15;

        this.gameOverCallback = null;
        this.scoreElements = null;

        // spawn rates
        this.trampolineChance = 0.15; // 15% of new platforms are trampolines
        this.copterChance = 0.12; // 12% chance to spawn a copter near platforms
        this.breakableChance = 0.12; // 12% chance to spawn a breakable platform
    }

    init() {
        this.score = 0;
        this.platforms = [];
        this.powerUps = [];
        this.scrollOffset = 0;
        this.highestPlatform = 0;
        this.player.reset();
        this.generateInitialPlatforms();
        this.updateScore();
    }

    generateInitialPlatforms() {
        this.platforms.push(new NormalPlatform(
            this.player.x - this.platformWidth / 2,
            this.player.y + this.player.height + 5,
            this.platformWidth,
            this.platformHeight
        ));

        const spaceBetweenPlatforms = this.canvas.height / this.platformCount;

        for (let i = 1; i < this.platformCount; i++) {
            let x = Math.random() * (this.canvas.width - 90);
            let y = this.canvas.height - (i * spaceBetweenPlatforms) - Math.random() * 20;

            const isTrampoline = Math.random() < this.trampolineChance && i > 1;
            const isBreakable = Math.random() < 0.08 && i > 2; // small chance for breakable after early safe platforms
            if (isTrampoline) {
                this.platforms.push(new TrampolinePlatform(x, y, this.platformWidth, this.platformHeight));
            } else if (isBreakable) {
                this.platforms.push(new BreakablePlatform(x, y, this.platformWidth, this.platformHeight));
            } else {
                this.platforms.push(new NormalPlatform(x, y, this.platformWidth, this.platformHeight));
            }

            if (Math.random() < this.copterChance && i > 1) {
                const puX = x + Math.random() * 20 + 20;
                const puY = y - 40;
                this.powerUps.push(new PowerUp('copter', puX, puY));
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

        const isTrampoline = Math.random() < this.trampolineChance;
        const isBreakable = Math.random() < this.breakableChance;
        if (isBreakable) {
            this.platforms.push(new BreakablePlatform(x, y, this.platformWidth, this.platformHeight));
        } else if (isTrampoline) {
            this.platforms.push(new TrampolinePlatform(x, y, this.platformWidth, this.platformHeight));
        } else {
            this.platforms.push(new NormalPlatform(x, y, this.platformWidth, this.platformHeight));
        }
        this.highestPlatform = y;

        if (Math.random() < this.copterChance) {
            const puX = x + Math.random() * 20 + 20;
            const puY = y - 40;
            this.powerUps.push(new PowerUp('copter', puX, puY));
        }
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
        // pass a rough delta time (ms) derived from 60fps; for real-time you could measure timestamps
        this.player.update(this.gravity, 1000 / 60);

        this.platforms.forEach(platform => {
            if (platform.isActive() && this.player.checkCollision(platform)) {
                platform.onLand(this.player);
            }
        });

        // handle power-up collisions (AABB)
        this.powerUps = this.powerUps.filter(pu => {
            const collides = (
                this.player.x < pu.x + pu.width &&
                this.player.x + this.player.width > pu.x &&
                this.player.y < pu.y + pu.height &&
                this.player.y + this.player.height > pu.y
            );
            if (collides) {
                if (pu.type === 'copter') {
                    this.player.activateCopter(3000); // 3 seconds
                }
                return false; // consume
            }
            return true;
        });

        if (this.player.y < this.canvas.height / 3 && this.player.velocityY < 0) {
            this.scrollOffset -= this.player.velocityY;

            this.platforms.forEach(platform => {
                platform.y -= this.player.velocityY;
            });
            this.powerUps.forEach(pu => {
                pu.y -= this.player.velocityY;
            });

            this.score -= this.player.velocityY / 10;
            this.updateScore();
            this.player.y -= this.player.velocityY;
        }

        this.platforms = this.platforms.filter(platform => platform.y < this.canvas.height + platform.height && platform.isActive());
        this.powerUps = this.powerUps.filter(pu => pu.y < this.canvas.height + pu.height);

        while (this.platforms.length < this.platformCount) {
            this.generateNewPlatform();
        }

        if (this.player.y > this.canvas.height) {
            this.gameOver();
            return;
        }

        this.renderer.drawPlatforms(this.platforms);
        this.renderer.drawPowerUps(this.powerUps);
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
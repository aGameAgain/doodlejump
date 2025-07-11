export default class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlatforms(platforms) {
        platforms.forEach(platform => {
            platform.draw(this.ctx);
        });
    }

    drawPlayer(player) {
        player.draw(this.ctx);
    }

    updateScore(score, scoreElement, finalScoreElement) {
        const displayScore = Math.floor(score).toString();
        scoreElement.textContent = displayScore;
        finalScoreElement.textContent = displayScore;
    }
}
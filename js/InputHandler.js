export default class InputHandler {
    constructor(player) {
        this.player = player;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.player.leftPressed = true;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.player.rightPressed = true;
        }
    }

    handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            this.player.leftPressed = false;
        }
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            this.player.rightPressed = false;
        }
    }
}
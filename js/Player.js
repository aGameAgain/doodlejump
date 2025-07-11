export default class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 40;
        this.velocityY = 0;
        this.velocityX = 0;
        this.jumpForce = -12;
        this.speed = 6;
        this.color = '#4CAF50';
        this.jumping = false;
        this.highestPoint = canvas.height;
        this.leftPressed = false;
        this.rightPressed = false;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.velocityY = 0;
        this.velocityX = 0;
        this.highestPoint = this.canvas.height;
        this.leftPressed = false;
        this.rightPressed = false;
    }

    update(gravity) {
        this.velocityY += gravity;
        this.y += this.velocityY;

        if (this.leftPressed) {
            this.velocityX = -this.speed;
        } else if (this.rightPressed) {
            this.velocityX = this.speed;
        } else {
            this.velocityX = 0;
        }

        this.x += this.velocityX;

        if (this.x + this.width < 0) {
            this.x = this.canvas.width;
        } else if (this.x > this.canvas.width) {
            this.x = -this.width;
        }
    }

    jump() {
        this.velocityY = this.jumpForce;
        this.jumping = true;
    }

    checkCollision(platform) {
        if (this.velocityY >= 0) {
            if (
                this.y + this.height >= platform.y - 2 &&
                this.y + this.height <= platform.y + platform.height + 2 &&
                this.x + this.width > platform.x &&
                this.x < platform.x + platform.width
            ) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 8, this.y + 10, 8, 8);
        ctx.fillRect(this.x + 24, this.y + 10, 8, 8);
        ctx.fillStyle = '#000';
        if (this.velocityY < 0) {
            ctx.fillRect(this.x + 16, this.y + 25, 8, 3);
        } else {
            ctx.fillRect(this.x + 16, this.y + 28, 8, 3);
        }
    }
}
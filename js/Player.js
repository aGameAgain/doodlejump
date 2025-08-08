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
        this.tiltAxis = 0; // -1..1 analog horizontal axis

        // power-up state
        this.isCopterActive = false;
        this.copterRemainingMs = 0;
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.velocityY = 0;
        this.velocityX = 0;
        this.highestPoint = this.canvas.height;
        this.leftPressed = false;
        this.rightPressed = false;
        this.tiltAxis = 0;
        this.isCopterActive = false;
        this.copterRemainingMs = 0;
    }

    update(gravity, deltaMs = 16.6667) {
        // If copter active, maintain a strong upward velocity and ignore gravity
        if (this.isCopterActive) {
            this.velocityY = -8; // faster ascent
        } else {
            this.velocityY += gravity;
        }
        this.y += this.velocityY;

        if (this.leftPressed) {
            this.velocityX = -this.speed;
        } else if (this.rightPressed) {
            this.velocityX = this.speed;
        } else if (typeof this.tiltAxis === 'number' && this.tiltAxis !== 0) {
            // Analog tilt influence. Direction aligns with tilt sign.
            this.velocityX = this.speed * this.tiltAxis;
        } else {
            this.velocityX = 0;
        }

        this.x += this.velocityX;

        if (this.x + this.width < 0) {
            this.x = this.canvas.width;
        } else if (this.x > this.canvas.width) {
            this.x = -this.width;
        }

        // handle copter timer using frame delta
        if (this.isCopterActive) {
            this.copterRemainingMs -= deltaMs;
            if (this.copterRemainingMs <= 0) {
                this.isCopterActive = false;
                this.copterRemainingMs = 0;
            }
        }
    }

    jump(multiplier = 1) {
        this.velocityY = this.jumpForce * multiplier;
        this.jumping = true;
    }

    activateCopter(durationMs) {
        this.isCopterActive = true;
        this.copterRemainingMs = durationMs;
        // strong initial upward speed
        this.velocityY = -8;
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

        // optional: small indicator when copter is active
        if (this.isCopterActive) {
            ctx.fillStyle = '#FF9800';
            ctx.fillRect(this.x + this.width / 2 - 14, this.y - 6, 28, 4);
        }
    }
}
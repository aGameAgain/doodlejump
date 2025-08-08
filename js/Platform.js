class PlatformBase {
    constructor(x, y, width = 70, height = 15) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = '#444';
    }

    onLand(player) {
        // override in subclasses
    }

    isActive() {
        return true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#666';
        ctx.fillRect(this.x, this.y, this.width, 2);
    }
}

export class NormalPlatform extends PlatformBase {
    constructor(x, y, width = 70, height = 15) {
        super(x, y, width, height);
        this.color = '#444';
    }

    onLand(player) {
        player.jump();
    }
}

export class TrampolinePlatform extends PlatformBase {
    constructor(x, y, width = 70, height = 15) {
        super(x, y, width, height);
        this.color = '#2ecc71';
    }

    onLand(player) {
        player.jump(1.6);
    }
}

export class BreakablePlatform extends PlatformBase {
    constructor(x, y, width = 70, height = 15) {
        super(x, y, width, height);
        this.color = '#F3EBEE';
        this.broken = false;
    }

    onLand(player) {
        if (!this.broken) {
            player.jump();
            this.broken = true;
        }
    }

    isActive() {
        return !this.broken;
    }

    draw(ctx) {
        // base body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // top edge
        ctx.fillStyle = '#666';
        ctx.fillRect(this.x, this.y, this.width, 2);

        // crack lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;

        // main crack: from top center to bottom-right
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.5, this.y + 3);
        ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.5);
        ctx.lineTo(this.x + this.width * 0.6, this.y + this.height - 2);
        ctx.stroke();

        // branch crack: from middle to left
        ctx.beginPath();
        ctx.moveTo(this.x + this.width * 0.65, this.y + this.height * 0.6);
        ctx.lineTo(this.x + this.width * 0.4, this.y + this.height * 0.7);
        ctx.stroke();
    }
}

// Backwards-compatible default export behaves as the previous "normal" platform
export default class Platform extends NormalPlatform { }
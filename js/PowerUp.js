export default class PowerUp {
    constructor(type, x, y, width = 24, height = 24) {
        this.type = type; // e.g., 'copter'
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        // simple color/icon by type
        this.color = type === 'copter' ? '#FF9800' : '#03A9F4';
    }

    get boundingBox() {
        return { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    draw(ctx) {
        // Draw a simple representation for the power-up
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (this.type === 'copter') {
            // propeller bar
            ctx.fillStyle = '#FFF';
            ctx.fillRect(this.x - 4, this.y - 4, this.width + 8, 4);
        }
    }
}

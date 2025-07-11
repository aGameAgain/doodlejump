export default class Platform {
    constructor(x, y, width = 70, height = 15) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        const colors = ['#333', '#444', '#555'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#666';
        ctx.fillRect(this.x, this.y, this.width, 2);
    }
}
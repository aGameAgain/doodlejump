import { jest } from '@jest/globals';
import Player from '../js/Player.js';

// Mock canvas for testing
const mockCanvas = {
    width: 400,
    height: 600
};

describe('Player', () => {
    let player;

    beforeEach(() => {
        player = new Player(mockCanvas);
    });

    describe('constructor', () => {
        test('should initialize with correct default values', () => {
            expect(player.x).toBe(200); // canvas.width / 2
            expect(player.y).toBe(300); // canvas.height / 2
            expect(player.width).toBe(40);
            expect(player.height).toBe(40);
            expect(player.velocityY).toBe(0);
            expect(player.velocityX).toBe(0);
            expect(player.jumpForce).toBe(-12);
            expect(player.speed).toBe(6);
            expect(player.color).toBe('#4CAF50');
            expect(player.jumping).toBe(false);
            expect(player.leftPressed).toBe(false);
            expect(player.rightPressed).toBe(false);
        });
    });

    describe('reset', () => {
        test('should reset player to initial state', () => {
            // Change some values
            player.x = 100;
            player.y = 100;
            player.velocityY = 5;
            player.velocityX = 3;
            player.leftPressed = true;
            player.rightPressed = true;

            player.reset();

            expect(player.x).toBe(200);
            expect(player.y).toBe(300);
            expect(player.velocityY).toBe(0);
            expect(player.velocityX).toBe(0);
            expect(player.leftPressed).toBe(false);
            expect(player.rightPressed).toBe(false);
        });
    });

    describe('update', () => {
        test('should apply gravity to velocityY', () => {
            const gravity = 0.2;
            const initialVelocityY = player.velocityY;
            
            player.update(gravity);
            
            expect(player.velocityY).toBe(initialVelocityY + gravity);
        });

        test('should update position based on velocity', () => {
            player.velocityY = 5;
            const initialY = player.y;
            const initialX = player.x;
            
            player.update(0.2);
            
            expect(player.y).toBe(initialY + 5.2); // 5 + 0.2 gravity
            expect(player.x).toBe(initialX); // No horizontal movement without input
        });

        test('should move left when leftPressed is true', () => {
            player.leftPressed = true;
            const initialX = player.x;
            
            player.update(0.2);
            
            expect(player.velocityX).toBe(-player.speed);
            expect(player.x).toBe(initialX - player.speed);
        });

        test('should move right when rightPressed is true', () => {
            player.rightPressed = true;
            const initialX = player.x;
            
            player.update(0.2);
            
            expect(player.velocityX).toBe(player.speed);
            expect(player.x).toBe(initialX + player.speed);
        });

        test('should wrap around screen horizontally', () => {
            // Test wrapping to right side
            player.x = -player.width - 1;
            player.update(0.2);
            expect(player.x).toBe(mockCanvas.width);

            // Test wrapping to left side
            player.x = mockCanvas.width + 1;
            player.update(0.2);
            expect(player.x).toBe(-player.width);
        });
    });

    describe('jump', () => {
        test('should set velocityY to jumpForce and jumping to true', () => {
            player.jump();
            
            expect(player.velocityY).toBe(player.jumpForce);
            expect(player.jumping).toBe(true);
        });
    });

    describe('checkCollision', () => {
        let platform;

        beforeEach(() => {
            platform = {
                x: 180,
                y: 350,
                width: 70,
                height: 15
            };
            // Position player above platform
            player.x = 200;
            player.y = 330;
            player.velocityY = 5; // falling down
        });

        test('should detect collision when player lands on platform', () => {
            player.y = platform.y - player.height; // Just touching platform
            
            const collision = player.checkCollision(platform);
            
            expect(collision).toBe(true);
        });

        test('should not detect collision when player is rising', () => {
            player.velocityY = -5; // rising up
            
            const collision = player.checkCollision(platform);
            
            expect(collision).toBe(false);
        });

        test('should not detect collision when player is not horizontally aligned', () => {
            player.x = 100; // Not aligned with platform
            
            const collision = player.checkCollision(platform);
            
            expect(collision).toBe(false);
        });

        test('should not detect collision when player is too far from platform', () => {
            player.y = 200; // Too far above platform
            
            const collision = player.checkCollision(platform);
            
            expect(collision).toBe(false);
        });
    });

    describe('draw', () => {
        let mockCtx;

        beforeEach(() => {
            mockCtx = {
                fillStyle: '',
                fillRect: jest.fn()
            };
        });

        test('should draw player body with correct color and position', () => {
            player.draw(mockCtx);
            
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                player.x, player.y, player.width, player.height
            );
            
            // Check that fillRect was called for body, eyes, and mouth
            expect(mockCtx.fillRect).toHaveBeenCalledTimes(4);
        });

        test('should draw eyes', () => {
            player.draw(mockCtx);
            
            // Check for eye drawing calls
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                player.x + 8, player.y + 10, 8, 8
            );
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                player.x + 24, player.y + 10, 8, 8
            );
        });

        test('should draw happy expression when rising', () => {
            player.velocityY = -5; // rising
            player.draw(mockCtx);
            
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                player.x + 16, player.y + 25, 8, 3
            );
        });

        test('should draw neutral expression when falling', () => {
            player.velocityY = 5; // falling
            player.draw(mockCtx);
            
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                player.x + 16, player.y + 28, 8, 3
            );
        });
    });
});
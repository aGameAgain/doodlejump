import { jest } from '@jest/globals';
import Platform from '../js/Platform.js';

describe('Platform', () => {
    let platform;

    beforeEach(() => {
        platform = new Platform(100, 200);
    });

    describe('constructor', () => {
        test('should initialize with provided x and y coordinates', () => {
            expect(platform.x).toBe(100);
            expect(platform.y).toBe(200);
        });

        test('should use default width and height when not provided', () => {
            expect(platform.width).toBe(70);
            expect(platform.height).toBe(15);
        });

        test('should use custom width and height when provided', () => {
            const customPlatform = new Platform(50, 100, 90, 20);
            expect(customPlatform.width).toBe(90);
            expect(customPlatform.height).toBe(20);
        });

        test('should assign a random color from predefined colors', () => {
            const validColors = ['#333', '#444', '#555'];
            expect(validColors).toContain(platform.color);
        });

        test('should create platforms with different colors', () => {
            // Create multiple platforms to test randomness
            const platforms = [];
            for (let i = 0; i < 20; i++) {
                platforms.push(new Platform(0, 0));
            }
            
            const colors = platforms.map(p => p.color);
            const uniqueColors = [...new Set(colors)];
            
            // Should have at least 2 different colors in 20 platforms
            expect(uniqueColors.length).toBeGreaterThan(1);
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

        test('should draw platform body with correct color and dimensions', () => {
            platform.draw(mockCtx);
            
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                platform.x, platform.y, platform.width, platform.height
            );
            
            // Check that the platform color was used (it gets overwritten by edge color)
            expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
        });

        test('should draw platform edge with correct color and dimensions', () => {
            platform.draw(mockCtx);
            
            // Check if edge is drawn with correct color
            expect(mockCtx.fillStyle).toBe('#666');
            expect(mockCtx.fillRect).toHaveBeenCalledWith(
                platform.x, platform.y, platform.width, 2
            );
        });

        test('should call fillRect exactly twice (body and edge)', () => {
            platform.draw(mockCtx);
            
            expect(mockCtx.fillRect).toHaveBeenCalledTimes(2);
        });

        test('should draw correctly for custom sized platform', () => {
            const customPlatform = new Platform(50, 100, 90, 20);
            customPlatform.draw(mockCtx);
            
            // Check body drawing
            expect(mockCtx.fillRect).toHaveBeenCalledWith(50, 100, 90, 20);
            
            // Check edge drawing
            expect(mockCtx.fillRect).toHaveBeenCalledWith(50, 100, 90, 2);
        });
    });

    describe('properties', () => {
        test('should maintain immutable position after creation', () => {
            const originalX = platform.x;
            const originalY = platform.y;
            
            // Platform positions shouldn't change unless explicitly modified
            expect(platform.x).toBe(originalX);
            expect(platform.y).toBe(originalY);
        });

        test('should allow position modification', () => {
            platform.x = 150;
            platform.y = 250;
            
            expect(platform.x).toBe(150);
            expect(platform.y).toBe(250);
        });

        test('should maintain dimensions after creation', () => {
            const originalWidth = platform.width;
            const originalHeight = platform.height;
            
            expect(platform.width).toBe(originalWidth);
            expect(platform.height).toBe(originalHeight);
        });
    });
});
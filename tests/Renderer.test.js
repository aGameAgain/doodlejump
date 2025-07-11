import { jest } from '@jest/globals';
import Renderer from '../js/Renderer.js';

describe('Renderer', () => {
    let renderer;
    let mockCanvas;
    let mockCtx;

    beforeEach(() => {
        mockCanvas = {
            width: 400,
            height: 600
        };
        
        mockCtx = {
            clearRect: jest.fn(),
            fillStyle: '',
            fillRect: jest.fn()
        };
        
        renderer = new Renderer(mockCanvas, mockCtx);
    });

    describe('constructor', () => {
        test('should store canvas and context references', () => {
            expect(renderer.canvas).toBe(mockCanvas);
            expect(renderer.ctx).toBe(mockCtx);
        });
    });

    describe('clear', () => {
        test('should clear the entire canvas', () => {
            renderer.clear();
            
            expect(mockCtx.clearRect).toHaveBeenCalledWith(
                0, 0, mockCanvas.width, mockCanvas.height
            );
        });

        test('should call clearRect exactly once', () => {
            renderer.clear();
            
            expect(mockCtx.clearRect).toHaveBeenCalledTimes(1);
        });
    });

    describe('drawPlatforms', () => {
        let mockPlatforms;

        beforeEach(() => {
            mockPlatforms = [
                { draw: jest.fn() },
                { draw: jest.fn() },
                { draw: jest.fn() }
            ];
        });

        test('should call draw on each platform', () => {
            renderer.drawPlatforms(mockPlatforms);
            
            mockPlatforms.forEach(platform => {
                expect(platform.draw).toHaveBeenCalledWith(mockCtx);
            });
        });

        test('should handle empty platforms array', () => {
            expect(() => renderer.drawPlatforms([])).not.toThrow();
        });

        test('should handle single platform', () => {
            const singlePlatform = [{ draw: jest.fn() }];
            renderer.drawPlatforms(singlePlatform);
            
            expect(singlePlatform[0].draw).toHaveBeenCalledWith(mockCtx);
        });

        test('should maintain platform drawing order', () => {
            const drawOrder = [];
            mockPlatforms.forEach((platform, index) => {
                platform.draw = jest.fn(() => drawOrder.push(index));
            });
            
            renderer.drawPlatforms(mockPlatforms);
            
            expect(drawOrder).toEqual([0, 1, 2]);
        });
    });

    describe('drawPlayer', () => {
        let mockPlayer;

        beforeEach(() => {
            mockPlayer = {
                draw: jest.fn()
            };
        });

        test('should call draw on player with context', () => {
            renderer.drawPlayer(mockPlayer);
            
            expect(mockPlayer.draw).toHaveBeenCalledWith(mockCtx);
        });

        test('should call draw exactly once', () => {
            renderer.drawPlayer(mockPlayer);
            
            expect(mockPlayer.draw).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateScore', () => {
        let mockScoreElement;
        let mockFinalScoreElement;

        beforeEach(() => {
            mockScoreElement = {
                textContent: '0'
            };
            mockFinalScoreElement = {
                textContent: '0'
            };
        });

        test('should update score elements with floored score', () => {
            const score = 123.7;
            renderer.updateScore(score, mockScoreElement, mockFinalScoreElement);
            
            expect(mockScoreElement.textContent).toBe('123');
            expect(mockFinalScoreElement.textContent).toBe('123');
        });

        test('should handle zero score', () => {
            renderer.updateScore(0, mockScoreElement, mockFinalScoreElement);
            
            expect(mockScoreElement.textContent).toBe('0');
            expect(mockFinalScoreElement.textContent).toBe('0');
        });

        test('should handle negative score', () => {
            renderer.updateScore(-5.3, mockScoreElement, mockFinalScoreElement);
            
            expect(mockScoreElement.textContent).toBe('-6');
            expect(mockFinalScoreElement.textContent).toBe('-6');
        });

        test('should handle very large score', () => {
            renderer.updateScore(999999.9, mockScoreElement, mockFinalScoreElement);
            
            expect(mockScoreElement.textContent).toBe('999999');
            expect(mockFinalScoreElement.textContent).toBe('999999');
        });

        test('should handle integer score', () => {
            renderer.updateScore(100, mockScoreElement, mockFinalScoreElement);
            
            expect(mockScoreElement.textContent).toBe('100');
            expect(mockFinalScoreElement.textContent).toBe('100');
        });

        test('should convert score to string', () => {
            renderer.updateScore(42.8, mockScoreElement, mockFinalScoreElement);
            
            expect(typeof mockScoreElement.textContent).toBe('string');
            expect(typeof mockFinalScoreElement.textContent).toBe('string');
        });
    });

    describe('integration tests', () => {
        test('should handle complete render cycle', () => {
            const mockPlatforms = [
                { draw: jest.fn() },
                { draw: jest.fn() }
            ];
            const mockPlayer = { draw: jest.fn() };
            const mockScoreElement = { textContent: '0' };
            const mockFinalScoreElement = { textContent: '0' };
            
            // Simulate complete render cycle
            renderer.clear();
            renderer.drawPlatforms(mockPlatforms);
            renderer.drawPlayer(mockPlayer);
            renderer.updateScore(150.5, mockScoreElement, mockFinalScoreElement);
            
            expect(mockCtx.clearRect).toHaveBeenCalled();
            expect(mockPlatforms[0].draw).toHaveBeenCalledWith(mockCtx);
            expect(mockPlatforms[1].draw).toHaveBeenCalledWith(mockCtx);
            expect(mockPlayer.draw).toHaveBeenCalledWith(mockCtx);
            expect(mockScoreElement.textContent).toBe('150');
            expect(mockFinalScoreElement.textContent).toBe('150');
        });

        test('should handle render cycle with no platforms', () => {
            const mockPlayer = { draw: jest.fn() };
            
            renderer.clear();
            renderer.drawPlatforms([]);
            renderer.drawPlayer(mockPlayer);
            
            expect(mockCtx.clearRect).toHaveBeenCalled();
            expect(mockPlayer.draw).toHaveBeenCalledWith(mockCtx);
        });
    });

    describe('error handling', () => {
        test('should handle null score elements gracefully', () => {
            expect(() => {
                renderer.updateScore(100, null, null);
            }).toThrow(); // This should throw since we're accessing textContent
        });

        test('should handle missing draw method on platforms', () => {
            const badPlatforms = [{}]; // Platform without draw method
            
            expect(() => {
                renderer.drawPlatforms(badPlatforms);
            }).toThrow();
        });

        test('should handle missing draw method on player', () => {
            const badPlayer = {}; // Player without draw method
            
            expect(() => {
                renderer.drawPlayer(badPlayer);
            }).toThrow();
        });
    });
});
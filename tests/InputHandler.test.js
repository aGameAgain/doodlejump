import { jest } from '@jest/globals';
import InputHandler from '../js/InputHandler.js';

// Mock document.addEventListener globally
const mockAddEventListener = jest.fn();
global.document = {
    addEventListener: mockAddEventListener
};

describe('InputHandler', () => {
    let inputHandler;
    let mockPlayer;

    beforeEach(() => {
        mockPlayer = {
            leftPressed: false,
            rightPressed: false
        };
        
        // Clear mock calls
        mockAddEventListener.mockClear();
        
        inputHandler = new InputHandler(mockPlayer);
    });

    describe('constructor', () => {
        test('should store player reference', () => {
            expect(inputHandler.player).toBe(mockPlayer);
        });
    });

    describe('handleKeyDown', () => {
        test('should set leftPressed to true for left arrow key', () => {
            const event = { key: 'ArrowLeft' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.leftPressed).toBe(true);
        });

        test('should set leftPressed to true for "a" key', () => {
            const event = { key: 'a' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.leftPressed).toBe(true);
        });

        test('should set leftPressed to true for "A" key', () => {
            const event = { key: 'A' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.leftPressed).toBe(true);
        });

        test('should set rightPressed to true for right arrow key', () => {
            const event = { key: 'ArrowRight' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.rightPressed).toBe(true);
        });

        test('should set rightPressed to true for "d" key', () => {
            const event = { key: 'd' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.rightPressed).toBe(true);
        });

        test('should set rightPressed to true for "D" key', () => {
            const event = { key: 'D' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.rightPressed).toBe(true);
        });

        test('should not change player state for unrecognized keys', () => {
            const event = { key: 'Space' };
            inputHandler.handleKeyDown(event);
            
            expect(mockPlayer.leftPressed).toBe(false);
            expect(mockPlayer.rightPressed).toBe(false);
        });

        test('should handle both left and right keys pressed simultaneously', () => {
            const leftEvent = { key: 'ArrowLeft' };
            const rightEvent = { key: 'ArrowRight' };
            
            inputHandler.handleKeyDown(leftEvent);
            inputHandler.handleKeyDown(rightEvent);
            
            expect(mockPlayer.leftPressed).toBe(true);
            expect(mockPlayer.rightPressed).toBe(true);
        });
    });

    describe('handleKeyUp', () => {
        beforeEach(() => {
            // Set both pressed states to true initially
            mockPlayer.leftPressed = true;
            mockPlayer.rightPressed = true;
        });

        test('should set leftPressed to false for left arrow key', () => {
            const event = { key: 'ArrowLeft' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.leftPressed).toBe(false);
        });

        test('should set leftPressed to false for "a" key', () => {
            const event = { key: 'a' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.leftPressed).toBe(false);
        });

        test('should set leftPressed to false for "A" key', () => {
            const event = { key: 'A' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.leftPressed).toBe(false);
        });

        test('should set rightPressed to false for right arrow key', () => {
            const event = { key: 'ArrowRight' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.rightPressed).toBe(false);
        });

        test('should set rightPressed to false for "d" key', () => {
            const event = { key: 'd' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.rightPressed).toBe(false);
        });

        test('should set rightPressed to false for "D" key', () => {
            const event = { key: 'D' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.rightPressed).toBe(false);
        });

        test('should not change player state for unrecognized keys', () => {
            const event = { key: 'Space' };
            inputHandler.handleKeyUp(event);
            
            expect(mockPlayer.leftPressed).toBe(true);
            expect(mockPlayer.rightPressed).toBe(true);
        });

        test('should handle releasing one key while other remains pressed', () => {
            const leftEvent = { key: 'ArrowLeft' };
            inputHandler.handleKeyUp(leftEvent);
            
            expect(mockPlayer.leftPressed).toBe(false);
            expect(mockPlayer.rightPressed).toBe(true);
        });
    });

    describe('key combinations', () => {
        test('should handle rapid key presses correctly', () => {
            const events = [
                { key: 'ArrowLeft' },
                { key: 'ArrowRight' },
                { key: 'a' },
                { key: 'D' }
            ];
            
            events.forEach(event => inputHandler.handleKeyDown(event));
            
            expect(mockPlayer.leftPressed).toBe(true);
            expect(mockPlayer.rightPressed).toBe(true);
        });

        test('should handle mixed case keys', () => {
            inputHandler.handleKeyDown({ key: 'a' });
            inputHandler.handleKeyDown({ key: 'D' });
            
            expect(mockPlayer.leftPressed).toBe(true);
            expect(mockPlayer.rightPressed).toBe(true);
            
            inputHandler.handleKeyUp({ key: 'A' });
            inputHandler.handleKeyUp({ key: 'd' });
            
            expect(mockPlayer.leftPressed).toBe(false);
            expect(mockPlayer.rightPressed).toBe(false);
        });
    });
});
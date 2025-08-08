import { jest } from '@jest/globals';
import Platform, { NormalPlatform, TrampolinePlatform, BreakablePlatform } from '../js/Platform.js';

describe('Platform variants', () => {
    let mockPlayer;

    beforeEach(() => {
        mockPlayer = { jump: jest.fn() };
    });

    describe('NormalPlatform', () => {
        test('onLand triggers normal jump (no multiplier arg)', () => {
            const p = new NormalPlatform(10, 20);
            p.onLand(mockPlayer);
            expect(mockPlayer.jump).toHaveBeenCalledTimes(1);
            expect(mockPlayer.jump).toHaveBeenCalledWith();
        });

        test('uses consistent color', () => {
            const p = new NormalPlatform(0, 0);
            expect(p.color).toBe('#444');
        });

        test('isActive remains true after landing', () => {
            const p = new NormalPlatform(0, 0);
            p.onLand(mockPlayer);
            expect(p.isActive()).toBe(true);
        });
    });

    describe('TrampolinePlatform', () => {
        test('onLand triggers stronger jump with multiplier 1.6', () => {
            const p = new TrampolinePlatform(10, 20);
            p.onLand(mockPlayer);
            expect(mockPlayer.jump).toHaveBeenCalledTimes(1);
            expect(mockPlayer.jump).toHaveBeenCalledWith(1.6);
        });

        test('uses trampoline color', () => {
            const p = new TrampolinePlatform(0, 0);
            expect(p.color).toBe('#2ecc71');
        });

        test('isActive remains true after landing', () => {
            const p = new TrampolinePlatform(0, 0);
            p.onLand(mockPlayer);
            expect(p.isActive()).toBe(true);
        });
    });

    describe('BreakablePlatform', () => {
        test('first landing triggers jump and breaks the platform', () => {
            const p = new BreakablePlatform(10, 20);
            p.onLand(mockPlayer);
            expect(mockPlayer.jump).toHaveBeenCalledTimes(1);
            expect(mockPlayer.jump).toHaveBeenCalledWith();
            expect(p.isActive()).toBe(false);
        });

        test('subsequent landings do not trigger jump again', () => {
            const p = new BreakablePlatform(10, 20);
            p.onLand(mockPlayer);
            mockPlayer.jump.mockClear();
            p.onLand(mockPlayer);
            expect(mockPlayer.jump).not.toHaveBeenCalled();
            expect(p.isActive()).toBe(false);
        });

        test('uses breakable light gray color', () => {
            const p = new BreakablePlatform(0, 0);
            expect(p.color).toBe('#bbbbbb');
        });
    });

    describe('Default export Platform (backward compatibility)', () => {
        test('behaves like NormalPlatform (color and onLand)', () => {
            const p = new Platform(0, 0);
            expect(p.color).toBe('#444');
            p.onLand(mockPlayer);
            expect(mockPlayer.jump).toHaveBeenCalledWith();
        });
    });
});



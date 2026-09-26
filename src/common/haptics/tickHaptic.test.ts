import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HAPTIC_TICK_MS, tickHaptic } from './tickHaptic';

describe('tickHaptic', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vi.fn(() => true) });
    });

    it('fires a short vibration tick', () => {
        tickHaptic();

        expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_TICK_MS);
    });
});

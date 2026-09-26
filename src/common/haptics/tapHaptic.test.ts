import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HAPTIC_TAP_MS, tapHaptic, withTapHaptic } from './tapHaptic';

describe('tapHaptic', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vi.fn(() => true) });
    });

    it('fires a short vibration tap', () => {
        tapHaptic();

        expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_TAP_MS);
    });

    it('wraps an onPress handler with a tap', () => {
        const onPress = vi.fn();

        withTapHaptic(onPress)();

        expect(navigator.vibrate).toHaveBeenCalledWith(HAPTIC_TAP_MS);
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('does nothing when onPress is missing', () => {
        withTapHaptic()();

        expect(navigator.vibrate).not.toHaveBeenCalled();
    });
});

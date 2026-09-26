/** Light tap for buttons, tabs, toggles, and other discrete presses. */
export const HAPTIC_TAP_MS = 12;

function vibrate(durationMs: number): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(durationMs);
    }
}

/** Fire a short haptic pulse for a UI tap. */
export function tapHaptic(): void {
    vibrate(HAPTIC_TAP_MS);
}

/**
 * Wrap a press handler so a tap haptic runs before the original callback.
 * Disabled / missing handlers stay no-ops without vibrating.
 */
export function withTapHaptic(onPress?: () => void): () => void {
    return () => {
        if (!onPress) {
            return;
        }
        tapHaptic();
        onPress();
    };
}

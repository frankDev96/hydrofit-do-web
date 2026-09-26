/** Short tick matching picker feedback. */
export const HAPTIC_TICK_MS = 10;

/** Light haptic pulse for per-item picker traversal. */
export function tickHaptic(): void {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(HAPTIC_TICK_MS);
    }
}

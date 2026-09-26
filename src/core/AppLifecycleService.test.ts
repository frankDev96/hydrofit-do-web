import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import AppLifecycleService from './AppLifecycleService';

describe('AppLifecycleService', () => {
    beforeEach(() => {
        resetMmkv();
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-08-19T09:00:00.000Z'));
        AppLifecycleService.stopNetworkListener();
    });

    afterEach(() => {
        AppLifecycleService.stopNetworkListener();
        vi.useRealTimers();
    });

    it('runs registered callbacks on the first foreground mount of a new day', () => {
        const reset = vi.fn();
        AppLifecycleService.registerResetCallback(reset);

        AppLifecycleService.onForegroundMount();

        expect(reset).toHaveBeenCalledTimes(1);
    });

    it('does not reset again on the same day', () => {
        const reset = vi.fn();
        AppLifecycleService.registerResetCallback(reset);

        AppLifecycleService.onForegroundMount();
        AppLifecycleService.onForegroundMount();

        expect(reset).toHaveBeenCalledTimes(1);
    });

    it('resets again when the local calendar day changes', () => {
        const reset = vi.fn();
        AppLifecycleService.registerResetCallback(reset);

        vi.setSystemTime(new Date(2026, 8, 3, 18, 0));
        AppLifecycleService.onForegroundMount();
        expect(reset).toHaveBeenCalledTimes(1);

        vi.setSystemTime(new Date(2026, 8, 4, 9, 0));
        AppLifecycleService.onForegroundMount();
        expect(reset).toHaveBeenCalledTimes(2);
    });

    it('starts and stops the browser online listener', () => {
        const stop = AppLifecycleService.startNetworkListener();
        AppLifecycleService.startNetworkListener();
        expect(typeof stop).toBe('function');
        stop();
        expect(() => AppLifecycleService.startNetworkListener()).not.toThrow();
    });
});

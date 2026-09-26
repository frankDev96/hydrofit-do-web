import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockCancelAll, mockClearPendingLogs, mockRequestRedraw } = vi.hoisted(() => ({
    mockCancelAll: vi.fn(async () => undefined),
    mockClearPendingLogs: vi.fn(async () => true),
    mockRequestRedraw: vi.fn(async () => true),
}));

vi.mock('@core', () => ({
    NotificationService: {
        cancelAll: mockCancelAll,
    },
    WidgetPinService: {
        clearPendingLogs: mockClearPendingLogs,
        requestRedraw: mockRequestRedraw,
    },
    AppLifecycleService: {
        registerResetCallback: vi.fn(),
        onForegroundMount: vi.fn(),
    },
}));

import {
    clearAllMmkvStorage,
    resetAllAppData,
    useAppStore,
    useHydrationStore,
    useOnboardingStore,
    useThemeStore,
} from '@stores';

describe('resetAllAppData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearAllMmkvStorage();
        useOnboardingStore.getState().reset();
        useAppStore.getState().reset();
        useThemeStore.getState().reset();
        useHydrationStore.getState().reset();
    });

    it('clears stores, cancels notifications, and returns to incomplete onboarding', async () => {
        useAppStore.getState().setLanguage('hi');
        useAppStore.getState().setDisplayName('Alex');
        useThemeStore.getState().setTheme('dark');
        useHydrationStore.getState().addIntake(250);
        useOnboardingStore.getState().setGender('male');
        useOnboardingStore.getState().complete();

        expect(useOnboardingStore.getState().isOnboardingCompleted).toBe(true);
        expect(useAppStore.getState().language).toBe('hi');

        await resetAllAppData();

        expect(mockCancelAll).toHaveBeenCalledTimes(1);
        expect(mockClearPendingLogs).toHaveBeenCalledTimes(1);
        expect(mockRequestRedraw).toHaveBeenCalledTimes(1);
        expect(useOnboardingStore.getState().isOnboardingCompleted).toBe(false);
        expect(useOnboardingStore.getState().gender).toBeNull();
        expect(useAppStore.getState().language).toBe('en');
        expect(useAppStore.getState().displayName).toBe('');
        expect(useThemeStore.getState().isDarkMode).toBe(false);
        expect(useHydrationStore.getState().todayIntakeMl).toBe(0);
        expect(useHydrationStore.getState().intakeByDate).toEqual({});
    });
});

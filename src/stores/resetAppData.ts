import { NotificationService, WidgetPinService } from '@core';
import { clearAllMmkvStorage } from './storage';
import { useAppStore } from './useAppStore';
import { useHydrationStore } from './useHydrationStore';
import { useMainTabStore } from './useMainTabStore';
import { useAdBannerStore } from './useAdBannerStore';
import { useNotificationInboxStore } from './useNotificationInboxStore';
import { useOnboardingStore } from './useOnboardingStore';
import { useThemeStore } from './useThemeStore';
import { useTipsProgressStore } from './useTipsProgressStore';

/**
 * Wipe persisted preferences / user data and return in-memory stores to defaults.
 * Flipping onboarding completion to false remounts RootNavigator onto Welcome
 * with a fresh stack (no back to Settings/Home).
 */
export async function resetAllAppData(): Promise<void> {
    await NotificationService.cancelAll();
    await WidgetPinService.clearPendingLogs();

    clearAllMmkvStorage();

    useHydrationStore.getState().reset();
    useAppStore.getState().reset();
    useThemeStore.getState().reset();
    useNotificationInboxStore.getState().reset();
    useTipsProgressStore.getState().reset();
    useMainTabStore.getState().reset();
    useAdBannerStore.getState().reset();
    // Last: gates RootNavigator back to Onboarding → Welcome
    useOnboardingStore.getState().reset();
    await WidgetPinService.requestRedraw();
}

import { resolveNotificationNav } from '@modules/hydration/utils/notificationNav';
import type { RootStackParamList } from '@navigation';
import { useMainTabStore } from '@stores/useMainTabStore';

type Navigate = (screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]) => void;

let ready = false;
let navigateImpl: Navigate = () => undefined;

export const navigationRef = {
    isReady(): boolean {
        return ready;
    },
    navigate(screen: keyof RootStackParamList, params?: RootStackParamList[keyof RootStackParamList]): void {
        if (!ready) return;
        if (params !== undefined) {
            navigateImpl(screen, params);
            return;
        }
        navigateImpl(screen);
    },
    bind(next: { isReady: () => boolean; navigate: Navigate }): void {
        ready = next.isReady();
        navigateImpl = next.navigate;
    },
};

const NavigationService = {
    navigate<Name extends keyof RootStackParamList>(screen: Name, params?: RootStackParamList[Name]): void {
        navigationRef.navigate(screen, params);
    },

    isReady(): boolean {
        return navigationRef.isReady();
    },

    handleNotificationPress(data: Record<string, unknown> | undefined | null, options?: { coldStart?: boolean }): void {
        const resolved = resolveNotificationNav(data);

        if (resolved.target === 'tips') {
            NavigationService.navigate('HydrationTips', resolved.tipId ? { tipId: resolved.tipId } : undefined);
            return;
        }

        if (resolved.target === 'profile') {
            NavigationService.navigate('Home');
            useMainTabStore.getState().openProfileWithFocus(resolved.achievementId);
            return;
        }

        if (options?.coldStart) {
            NavigationService.navigate('Home');
        }
    },
};

export default NavigationService;

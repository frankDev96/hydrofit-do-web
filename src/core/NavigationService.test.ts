import { beforeEach, describe, expect, it, vi } from 'vitest';

const { navigate, isReady, openProfileWithFocus } = vi.hoisted(() => ({
    navigate: vi.fn(),
    isReady: vi.fn(() => true),
    openProfileWithFocus: vi.fn(),
}));

vi.mock('@stores/useMainTabStore', () => ({
    useMainTabStore: {
        getState: () => ({
            openProfileWithFocus,
        }),
    },
}));

import NavigationService, { navigationRef } from './NavigationService';

describe('NavigationService', () => {
    beforeEach(() => {
        navigate.mockClear();
        openProfileWithFocus.mockClear();
        isReady.mockReturnValue(true);
        navigationRef.bind({ isReady, navigate });
    });

    it('navigates when the container is ready', () => {
        NavigationService.navigate('Home');
        expect(navigate).toHaveBeenCalledWith('Home');
        expect(NavigationService.isReady()).toBe(true);
        expect(navigationRef.isReady()).toBe(true);
    });

    it('navigates with params when provided', () => {
        NavigationService.navigate('HydrationTips', { tipId: 'morning-flush' });
        expect(navigate).toHaveBeenCalledWith('HydrationTips', { tipId: 'morning-flush' });
    });

    it('skips navigation when the container is not ready', () => {
        isReady.mockReturnValue(false);
        navigationRef.bind({ isReady, navigate });
        NavigationService.navigate('Home');
        expect(navigate).not.toHaveBeenCalled();
        expect(NavigationService.isReady()).toBe(false);
    });

    it('routes tip presses to HydrationTips', () => {
        NavigationService.handleNotificationPress({ nav: 'tips', tipId: 'morning-flush' });
        expect(navigate).toHaveBeenCalledWith('HydrationTips', { tipId: 'morning-flush' });
    });

    it('routes achievement presses to Home + profile focus', () => {
        NavigationService.handleNotificationPress({
            nav: 'profile',
            achievementId: 'first-drop',
        });
        expect(navigate).toHaveBeenCalledWith('Home');
        expect(openProfileWithFocus).toHaveBeenCalledWith('first-drop');
    });

    it('no-ops general presses unless cold start', () => {
        NavigationService.handleNotificationPress({ nav: 'app' });
        expect(navigate).not.toHaveBeenCalled();

        NavigationService.handleNotificationPress({ nav: 'app' }, { coldStart: true });
        expect(navigate).toHaveBeenCalledWith('Home');
    });
});

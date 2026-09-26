import { beforeEach, describe, expect, it } from 'vitest';
import { useMainTabStore } from './useMainTabStore';

describe('useMainTabStore', () => {
    beforeEach(() => {
        useMainTabStore.getState().reset();
    });

    it('switches the active tab', () => {
        useMainTabStore.getState().setActiveTab('Plan');
        expect(useMainTabStore.getState().activeTab).toBe('Plan');
    });

    it('opens profile with an optional achievement focus', () => {
        useMainTabStore.getState().openProfileWithFocus('first-drop');
        expect(useMainTabStore.getState()).toEqual(
            expect.objectContaining({
                activeTab: 'Profile',
                focusAchievementId: 'first-drop',
            }),
        );

        useMainTabStore.getState().openProfileWithFocus();
        expect(useMainTabStore.getState().focusAchievementId).toBeNull();
    });

    it('clears the focused achievement without changing the tab', () => {
        useMainTabStore.getState().openProfileWithFocus('habit-starter');
        useMainTabStore.getState().clearFocusAchievement();
        expect(useMainTabStore.getState().activeTab).toBe('Profile');
        expect(useMainTabStore.getState().focusAchievementId).toBeNull();
    });
});

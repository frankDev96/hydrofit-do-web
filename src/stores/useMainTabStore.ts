import { create } from 'zustand';
import type { TabKey } from '@common/ui';
import type { ProfileAchievementId } from '@modules/hydration/utils/profileAchievements';

export type MainTabState = {
    activeTab: TabKey;
    focusAchievementId: ProfileAchievementId | null;
};

export type MainTabStore = MainTabState & {
    setActiveTab: (tab: TabKey) => void;
    openProfileWithFocus: (achievementId?: ProfileAchievementId) => void;
    clearFocusAchievement: () => void;
    reset: () => void;
};

const INITIAL_STATE: MainTabState = {
    activeTab: 'Home',
    focusAchievementId: null,
};

export const useMainTabStore = create<MainTabStore>(set => ({
    ...INITIAL_STATE,

    setActiveTab: tab => set({ activeTab: tab }),

    openProfileWithFocus: achievementId =>
        set({
            activeTab: 'Profile',
            focusAchievementId: achievementId ?? null,
        }),

    clearFocusAchievement: () => set({ focusAchievementId: null }),

    reset: () => set({ ...INITIAL_STATE }),
}));

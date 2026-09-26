import { create } from 'zustand';

/**
 * Tab chrome owns the single AdBanner slot above BottomNavBar.
 * Screens request a dismissible override (achievement) or hide the slot
 * while a stack screen hosts its own closeable banner (Tips).
 */
export type AdBannerChrome = 'tab' | 'dismissible' | 'hidden';

export type AdBannerState = {
    chrome: AdBannerChrome;
};

export type AdBannerStore = AdBannerState & {
    showDismissible: () => void;
    clearDismissible: () => void;
    hideForOverlay: () => void;
    restoreFromOverlay: () => void;
    reset: () => void;
};

const INITIAL_STATE: AdBannerState = {
    chrome: 'tab',
};

export const useAdBannerStore = create<AdBannerStore>(set => ({
    ...INITIAL_STATE,

    showDismissible: () => set({ chrome: 'dismissible' }),

    clearDismissible: () =>
        set(state => ({
            chrome: state.chrome === 'dismissible' ? 'tab' : state.chrome,
        })),

    hideForOverlay: () => set({ chrome: 'hidden' }),

    restoreFromOverlay: () => set({ chrome: 'tab' }),

    reset: () => set({ ...INITIAL_STATE }),
}));

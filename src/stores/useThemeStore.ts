import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Themes, type ThemeColors, type ThemeMode } from '../theme/colors';
import { mmkvStorage } from './storage';

export interface ThemeState {
    theme: ThemeMode;
    isDarkMode: boolean;
}

export interface ThemeStore extends ThemeState {
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
    reset: () => void;
}

const LIGHT_STATE: ThemeState = {
    theme: 'light',
    isDarkMode: false,
};

function stateFor(theme: ThemeMode): ThemeState {
    return {
        theme,
        isDarkMode: theme === 'dark',
    };
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        set => ({
            ...LIGHT_STATE,

            setTheme: (theme: ThemeMode) => set(stateFor(theme)),

            toggleTheme: () => set(current => stateFor(current.theme === 'light' ? 'dark' : 'light')),

            reset: () => set(LIGHT_STATE),
        }),
        {
            name: 'hydrofit-theme-storage',
            storage: createJSONStorage(() => mmkvStorage),
            partialize: state => ({ theme: state.theme }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<ThemeState> | undefined;
                const theme =
                    persisted?.theme === 'dark' || persisted?.theme === 'light' ? persisted.theme : currentState.theme;
                return {
                    ...currentState,
                    ...stateFor(theme),
                };
            },
        },
    ),
);

export function selectThemeColors(state: ThemeState): ThemeColors {
    return Themes[state.theme];
}

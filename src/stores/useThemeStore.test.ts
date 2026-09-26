import { beforeEach, describe, expect, it } from 'vitest';
import { DarkColors, LightColors } from '@theme';
import { selectThemeColors, useThemeStore } from './useThemeStore';

describe('useThemeStore', () => {
    beforeEach(() => {
        useThemeStore.getState().reset();
    });

    it('starts in light mode', () => {
        const state = useThemeStore.getState();
        expect(state.theme).toBe('light');
        expect(state.isDarkMode).toBe(false);
        expect(selectThemeColors(state)).toBe(LightColors);
    });

    it('sets dark and light palettes', () => {
        useThemeStore.getState().setTheme('dark');
        expect(useThemeStore.getState().isDarkMode).toBe(true);
        expect(selectThemeColors(useThemeStore.getState())).toBe(DarkColors);

        useThemeStore.getState().setTheme('light');
        expect(useThemeStore.getState().isDarkMode).toBe(false);
        expect(selectThemeColors(useThemeStore.getState())).toBe(LightColors);
    });

    it('toggles between light and dark', () => {
        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().theme).toBe('dark');

        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().theme).toBe('light');
        expect(useThemeStore.getState().isDarkMode).toBe(false);
    });
});

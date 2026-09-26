'use client';

import { useEffect } from 'react';
import { selectThemeColors, useThemeStore } from '@/stores/useThemeStore';

const PAGE_VARS: Record<string, string> = {
    background: '--bg',
    surface: '--surface',
    text: '--text',
    textSecondary: '--muted',
    textMuted: '--faint',
    primary: '--primary',
    primaryDeep: '--primary-deep',
    border: '--border',
    success: '--success',
    primarySelected: '--wash',
};

/** Applies the shared HydroFit color tokens as CSS variables. */
export function ThemeRoot({ children }: { children: React.ReactNode }) {
    const theme = useThemeStore(state => state.theme);

    useEffect(() => {
        const colors = selectThemeColors({ theme, isDarkMode: theme === 'dark' });
        const root = document.documentElement;
        root.classList.toggle('dark', theme === 'dark');
        for (const [key, value] of Object.entries(colors)) {
            root.style.setProperty(`--hf-${key}`, value);
        }
        for (const [token, cssVar] of Object.entries(PAGE_VARS)) {
            const value = colors[token as keyof typeof colors];
            if (value) root.style.setProperty(cssVar, value);
        }
    }, [theme]);

    return children;
}

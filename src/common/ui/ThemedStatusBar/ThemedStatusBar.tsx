import React, { useEffect } from 'react';
import { useThemeStore } from '../../../stores/useThemeStore';
import { useColors } from '@theme';

export type ThemedStatusBarStyle = 'light-content' | 'dark-content' | 'default';

export type ThemedStatusBarProps = {
    /** Defaults to theme `background`. */
    backgroundColor?: string;
    /** Defaults from dark/light theme. */
    barStyle?: ThemedStatusBarStyle;
};

/**
 * Publishes the theme color for the browser chrome.
 */
export function ThemedStatusBar({ backgroundColor, barStyle }: ThemedStatusBarProps = {}): null {
    const isDarkMode = useThemeStore(state => state.isDarkMode);
    const colors = useColors();
    const resolvedBarStyle: ThemedStatusBarStyle = barStyle ?? (isDarkMode ? 'light-content' : 'dark-content');
    const resolvedBackground = backgroundColor ?? colors.background;

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const colorScheme = resolvedBarStyle === 'light-content' ? 'dark' : 'light';
        document.documentElement.style.colorScheme = colorScheme;
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', resolvedBackground);
    }, [resolvedBackground, resolvedBarStyle]);

    return null;
}

export default ThemedStatusBar;

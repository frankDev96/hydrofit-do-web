import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { LightColors } from '@theme';

vi.mock('@stores', () => ({
    useThemeStore: (selector: (state: { theme: 'light' | 'dark'; isDarkMode: boolean }) => unknown) =>
        selector({ theme: 'light', isDarkMode: false }),
}));

import { ThemedStatusBar } from './ThemedStatusBar';

describe('ThemedStatusBar', () => {
    it('publishes the theme background as the browser theme color', () => {
        render(<ThemedStatusBar />);
        expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
            LightColors.background,
        );
        expect(document.documentElement.style.colorScheme).toBe('light');
    });

    it('honors backgroundColor and barStyle overrides', () => {
        render(<ThemedStatusBar backgroundColor={LightColors.surfaceAlt} barStyle="light-content" />);
        expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe(
            LightColors.surfaceAlt,
        );
        expect(document.documentElement.style.colorScheme).toBe('dark');
    });
});

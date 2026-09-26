import { useMemo, type CSSProperties } from 'react';
import { Themes, type ThemeColors, type ThemeMode } from './colors';
import { useThemeStore } from '../stores/useThemeStore';

type StylesFactory<T> = (colors: ThemeColors) => T;
type CssMap<T> = { [K in keyof T]: CSSProperties };

const sheetCache = new WeakMap<StylesFactory<unknown>, Partial<Record<ThemeMode, unknown>>>();

export function useColors(): ThemeColors {
    const theme = useThemeStore(state => state.theme);
    return Themes[theme];
}

export function useThemedStyles<T extends Record<string, object>>(factory: StylesFactory<T>): CssMap<T> {
    const theme = useThemeStore(state => state.theme);
    const colors = Themes[theme];

    const productionStyles = useMemo(() => {
        let cached = sheetCache.get(factory) as Partial<Record<ThemeMode, T>> | undefined;
        if (!cached) {
            cached = {};
            sheetCache.set(factory, cached);
        }
        const existing = cached[theme];
        if (existing) {
            return existing as CssMap<T>;
        }
        const created = factory(colors);
        cached[theme] = created;
        return created as CssMap<T>;
    }, [factory, theme, colors]);

    // Fast Refresh can keep `factory` identity while its body changes. Skip the
    // sheet cache in dev so fontSize / spacing edits show without a full reload.
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        return factory(colors) as CssMap<T>;
    }

    return productionStyles as CssMap<T>;
}

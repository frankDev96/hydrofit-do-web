import type { CSSProperties } from 'react';

/** Style objects shared by web components. Android-only keys are ignored by the DOM. */
export type WebStyle = CSSProperties & {
    elevation?: number;
    includeFontPadding?: boolean;
    shadowColor?: string;
    shadowOffset?: { width: number; height: number };
    shadowOpacity?: number;
    shadowRadius?: number;
};

export type ViewStyle = WebStyle;
export type TextStyle = WebStyle;
export type ImageStyle = WebStyle;
export type ImageSource = string | number | { uri?: string; src?: string };
export type StyleProp<T = WebStyle> = T | false | null | undefined | ReadonlyArray<StyleProp<T>>;

export function imageSrc(source: ImageSource | null | undefined): string | undefined {
    if (typeof source === 'string') return source;
    if (source && typeof source === 'object') return source.uri ?? source.src;
    return undefined;
}

export const absoluteFill: CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
};

export function css(
    ...parts: Array<object | false | null | undefined | ReadonlyArray<object | false | null | undefined>>
): CSSProperties {
    const out: Record<string, unknown> = {};
    const walk = (
        value: object | false | null | undefined | ReadonlyArray<object | false | null | undefined>,
    ): void => {
        if (!value) return;
        if (Array.isArray(value)) {
            value.forEach(walk);
            return;
        }
        Object.assign(out, value);
    };
    parts.forEach(walk);
    return out as CSSProperties;
}

export function createStyles<T extends Record<string, WebStyle>>(styles: T): T {
    return styles;
}

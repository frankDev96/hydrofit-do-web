import React, { useMemo } from 'react';
import { css, type StyleProp, type ViewStyle } from '@/common/css';
import { Colors } from '@theme';

type GlowShadeIconProps = {
    width?: number;
    height?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
};

/** Soft radial glow layers. */
export function GlowShadeIcon({ width = 840, height = 840, color = Colors.primary, style }: GlowShadeIconProps) {
    const side = Math.max(width, height);
    const layers = useMemo(
        () =>
            [
                { scale: 0.84, opacity: 0.06 },
                { scale: 0.64, opacity: 0.08 },
                { scale: 0.44, opacity: 0.09 },
                { scale: 0.28, opacity: 0.1 },
                { scale: 0.16, opacity: 0.12 },
            ] as const,
        [],
    );

    return (
        <div
            style={css(
                { width: side, height: side, display: 'flex', alignItems: 'center', justifyContent: 'center' },
                style,
            )}
        >
            {layers.map(layer => {
                const diameter = side * layer.scale;
                return (
                    <span
                        key={layer.scale}
                        style={{
                            position: 'absolute',
                            width: diameter,
                            height: diameter,
                            borderRadius: diameter / 2,
                            backgroundColor: color,
                            opacity: layer.opacity,
                        }}
                    />
                );
            })}
        </div>
    );
}

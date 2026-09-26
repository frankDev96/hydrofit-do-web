import React from 'react';
import { absoluteFill, css } from '@/common/css';
import { Colors } from '@theme';

type PickerEdgeFadeProps = {
    position: 'top' | 'bottom';
    height?: number;
    fadeColor?: string;
};

/** Fog gradient masking the top or bottom edge of a drum picker wheel. */
export function PickerEdgeFade({
    position,
    height = 96,
    fadeColor = Colors.surfaceAlt,
}: PickerEdgeFadeProps): React.JSX.Element {
    const isTop = position === 'top';
    const gradientId = `picker-edge-fade-${position}`;

    return (
        <div style={css(styles.fade, isTop ? styles.top : styles.bottom, { height })}>
            <svg width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor={fadeColor} stopOpacity={isTop ? '1' : '0'} />
                        <stop offset="1" stopColor={fadeColor} stopOpacity={isTop ? '0' : '1'} />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
            </svg>
        </div>
    );
}

const styles = {
    fade: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 3,
    },
    top: {
        top: 0,
    },
    bottom: {
        bottom: 0,
    },
};

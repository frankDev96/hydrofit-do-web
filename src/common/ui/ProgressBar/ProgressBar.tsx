import React from 'react';
import { absoluteFill, css } from '@/common/css';
import { Colors, BorderRadius } from '@theme';

type ProgressBarProps = {
    /** Progress from 0–1 */
    progress: number;
    height?: number;
    trackColor?: string;
    fillColor?: string;
};

/**
 * Horizontal rounded progress bar with optional glow on the fill.
 */
export function ProgressBar({
    progress,
    height = 8,
    trackColor = Colors.divider,
    fillColor = Colors.onboardingAccent,
}: ProgressBarProps): React.JSX.Element {
    const clamped = Math.min(1, Math.max(0, progress));

    return (
        <div style={css(styles.track, { height, backgroundColor: trackColor })}>
            <div
                style={css(styles.fill, {
                    width: `${clamped * 100}%`,
                    backgroundColor: fillColor,
                    shadowColor: fillColor,
                })}
            />
        </div>
    );
}

const styles = {
    track: {
        alignSelf: 'stretch',
        width: '100%',
        minHeight: 8,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: BorderRadius.full,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 2,
    },
};

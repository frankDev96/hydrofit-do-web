import React from 'react';
import { absoluteFill, css, type ViewStyle } from '@/common/css';
import { BorderRadius, CelebrationLayout, Spacing, useColors, useThemedStyles, type ThemeColors } from '@theme';

export type ConfettiBurstProps = {
    active: boolean;
};

export function ConfettiBurst({ active }: ConfettiBurstProps): React.JSX.Element | null {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    if (!active) {
        return null;
    }

    const palette = [colors.primary, colors.accentCyan, colors.accentOrange, colors.success, colors.warning];

    return (
        <div aria-hidden style={styles.layer}>
            {Array.from({ length: CelebrationLayout.pieceCount }, (_, index) => {
                const leftPercent = ((index + 0.5) / CelebrationLayout.pieceCount) * 100;
                const shape = index % 2 === 0 ? styles.pieceRect : styles.pieceDot;
                return (
                    <span
                        key={index}
                        data-testid="confetti-piece"
                        style={css(styles.piece, shape, {
                            left: `${leftPercent}%`,
                            backgroundColor: palette[index % palette.length] ?? colors.primary,
                            animationDelay: `${index * CelebrationLayout.pieceStaggerMs}ms`,
                            animationDuration: `${CelebrationLayout.fallDurationMs}ms`,
                        })}
                    />
                );
            })}
        </div>
    );
}

const createStyles = (_colors: ThemeColors) => ({
    layer: {
        ...absoluteFill,
        overflow: 'hidden',
    } satisfies ViewStyle,
    piece: {
        position: 'absolute' as const,
        top: Spacing.md,
        animationName: 'hydrofit-confetti',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards' as const,
    },
    pieceRect: {
        width: CelebrationLayout.pieceWidth,
        height: CelebrationLayout.pieceHeight,
        borderRadius: BorderRadius.xs,
    },
    pieceDot: {
        width: Spacing.sm,
        height: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
});

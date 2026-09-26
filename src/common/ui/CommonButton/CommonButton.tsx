import React, { useState } from 'react';
import { css, type StyleProp, type ViewStyle } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { BorderRadius, Spacing, TouchTarget, Typography, useThemedStyles, type ThemeColors } from '@theme';

export type CommonButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
export type CommonButtonSize = 'min' | 'compact' | 'primary';
export type CommonButtonShape = 'pill' | 'rounded';

export type CommonButtonProps = {
    label: string;
    onPress: () => void;
    variant?: CommonButtonVariant;
    size?: CommonButtonSize;
    shape?: CommonButtonShape;
    disabled?: boolean;
    elevated?: boolean;
    fullWidth?: boolean;
    accessibilityLabel?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

const SIZE_HEIGHT: Record<CommonButtonSize, number> = {
    min: TouchTarget.min,
    compact: TouchTarget.compact,
    primary: TouchTarget.primary,
};

export function CommonButton({
    label,
    onPress,
    variant = 'primary',
    size = 'primary',
    shape = 'pill',
    disabled = false,
    elevated = false,
    fullWidth = true,
    accessibilityLabel,
    leadingIcon,
    trailingIcon,
    style,
}: CommonButtonProps): React.JSX.Element {
    const styles = useThemedStyles(createStyles);
    const [pressed, setPressed] = useState(false);

    return (
        <button
            type="button"
            onClick={disabled ? undefined : withTapHaptic(onPress)}
            disabled={disabled}
            aria-label={accessibilityLabel ?? label}
            aria-disabled={disabled}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
            style={css(
                styles.base,
                { height: SIZE_HEIGHT[size] },
                shape === 'pill' ? styles.shapePill : styles.shapeRounded,
                fullWidth && styles.fullWidth,
                variant === 'primary' && styles.variantPrimary,
                variant === 'secondary' && styles.variantSecondary,
                variant === 'destructive' && styles.variantDestructive,
                variant === 'ghost' && styles.variantGhost,
                elevated && variant === 'primary' && styles.elevatedPrimary,
                disabled && styles.disabled,
                pressed && !disabled && styles.pressed,
                style,
            )}
        >
            <div style={styles.content}>
                {leadingIcon}
                <span
                    style={css(
                        styles.label,
                        variant === 'primary' && styles.labelPrimary,
                        variant === 'secondary' && styles.labelSecondary,
                        variant === 'destructive' && styles.labelDestructive,
                        variant === 'ghost' && styles.labelGhost,
                        disabled && styles.labelDisabled,
                    )}
                >
                    {label}
                </span>
                {trailingIcon}
            </div>
        </button>
    );
}

const createStyles = (colors: ThemeColors) => ({
    base: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
    },
    fullWidth: {
        alignSelf: 'stretch',
        width: '100%',
    },
    shapePill: {
        borderRadius: BorderRadius.full,
    },
    shapeRounded: {
        borderRadius: BorderRadius.md,
    },
    variantPrimary: {
        backgroundColor: colors.primary,
    },
    variantSecondary: {
        backgroundColor: colors.surfaceRaised,
    },
    variantDestructive: {
        backgroundColor: colors.errorSoft,
    },
    variantGhost: {
        backgroundColor: undefined,
    },
    elevatedPrimary: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: Spacing.sm },
        shadowOpacity: 0.25,
        shadowRadius: Spacing.md,
        elevation: 6,
    },
    disabled: {
        opacity: 0.5,
    },
    pressed: {
        opacity: 0.88,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        maxWidth: '100%',
    },
    label: {
        ...Typography.buttonLabel,
        textAlign: 'center',
        flexShrink: 0,
        paddingHorizontal: Spacing.xs,
    },
    labelPrimary: {
        color: colors.onPrimary,
    },
    labelSecondary: {
        color: colors.text,
    },
    labelDestructive: {
        color: colors.error,
    },
    labelGhost: {
        color: colors.primary,
    },
    labelDisabled: {
        color: colors.textSecondary,
    },
});

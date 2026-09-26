import React from 'react';
import { ClockOutlineIcon } from '@common/icons';
import { applyTimeOfDay, formatDateTo12Hour } from '@common/utils';
import {
    BorderRadius,
    IconSize,
    Spacing,
    TouchTarget,
    Typography,
    useColors,
    useThemedStyles,
    type ThemeColors,
} from '@theme';

export type CommonTimePickerProps = {
    value: Date;
    onChange: (date: Date) => void;
    accessibilityLabel?: string;
    disabled?: boolean;
};

function timeInputValue(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function CommonTimePicker({
    value,
    onChange,
    accessibilityLabel,
    disabled = false,
}: CommonTimePickerProps): React.JSX.Element {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const timeLabel = formatDateTo12Hour(value);

    return (
        <label style={styles.field}>
            <ClockOutlineIcon size={IconSize.lg} color={colors.primary} />
            <input
                type="time"
                value={timeInputValue(value)}
                disabled={disabled}
                aria-label={accessibilityLabel ?? timeLabel}
                style={styles.value}
                onChange={event => {
                    const [hours, minutes] = event.target.value.split(':').map(Number);
                    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
                    const next = new Date(value);
                    next.setHours(hours ?? 0, minutes ?? 0, 0, 0);
                    onChange(applyTimeOfDay(value, next));
                }}
            />
        </label>
    );
}

const createStyles = (colors: ThemeColors) => ({
    field: {
        minHeight: TouchTarget.compact,
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderStyle: 'solid' as const,
        borderColor: colors.border,
        borderRadius: BorderRadius.sm,
        paddingLeft: Spacing.gutter,
        paddingRight: Spacing.gutter,
        gap: Spacing.gutter,
    },
    value: {
        ...Typography.timePickerValue,
        flex: 1,
        color: colors.text,
        background: 'transparent',
        border: 'none',
    },
});

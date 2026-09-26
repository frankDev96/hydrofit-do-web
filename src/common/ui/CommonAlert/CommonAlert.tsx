import React from 'react';
import { absoluteFill, css } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { useTranslation } from '@i18n';
import { BorderRadius, IconSize, Spacing, Typography, useThemedStyles, type ThemeColors } from '@theme';
import { CommonButton, type CommonButtonVariant } from '../CommonButton/CommonButton';

export type CommonAlertButtonVariant = CommonButtonVariant;

export type CommonAlertButton = {
    label: string;
    onPress: () => void;
    variant?: CommonAlertButtonVariant;
    accessibilityLabel?: string;
};

export type CommonAlertProps = {
    visible: boolean;
    title: string;
    description?: string;
    icon?: React.ReactNode;
    buttons: CommonAlertButton[];
    onClose?: () => void;
};

export function CommonAlert({
    visible,
    title,
    description,
    icon,
    buttons,
    onClose,
}: CommonAlertProps): React.JSX.Element | null {
    const { t } = useTranslation();
    const styles = useThemedStyles(createStyles);

    const handleBackdropPress = withTapHaptic(onClose);

    if (!visible) {
        return null;
    }

    return (
        <div role="alertdialog" aria-label={title}>
            <div style={styles.backdrop} onClick={handleBackdropPress} aria-label={t('common.closeBackdrop')}>
                <div style={styles.card} onClick={event => event.stopPropagation()}>
                    {icon ? <div style={styles.iconWrap}>{icon}</div> : null}
                    <span style={styles.title}>{title}</span>
                    {description ? <span style={styles.description}>{description}</span> : null}
                    <div style={styles.actions}>
                        {buttons.map(button => (
                            <CommonButton
                                key={button.label}
                                label={button.label}
                                onPress={button.onPress}
                                variant={button.variant ?? 'primary'}
                                accessibilityLabel={button.accessibilityLabel ?? button.label}
                                size="min"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const createStyles = (colors: ThemeColors) => ({
    backdrop: {
        flex: 1,
        backgroundColor: colors.overlayScrim,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
    },
    card: {
        alignSelf: 'stretch',
        maxWidth: 400,
        backgroundColor: colors.cardBackground,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        padding: Spacing.lg,
        gap: Spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: Spacing.sm },
        shadowOpacity: 1,
        shadowRadius: Spacing.lg,
        elevation: 8,
        alignItems: 'center',
    },
    iconWrap: {
        width: IconSize.xxl,
        height: IconSize.xxl,
        borderRadius: BorderRadius.full,
        backgroundColor: colors.primarySoft,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...Typography.listItemTitleSelected,
        color: colors.text,
        textAlign: 'center',
    },
    description: {
        ...Typography.screenSubtitle,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    actions: {
        alignSelf: 'stretch',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
});

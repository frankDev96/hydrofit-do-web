import React from 'react';
import { css, type StyleProp, type ViewStyle } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { CloseIcon } from '@common/icons';
import { useTranslation } from '@i18n';
import { BorderRadius, useColors, useThemedStyles, type ThemeColors } from '@theme';

export type CommonModalProps = {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
};

export type CommonModalSectionProps = {
    label?: string;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export function CommonModalSection({ label, children, style }: CommonModalSectionProps): React.JSX.Element {
    const styles = useThemedStyles(createStyles);

    return (
        <div style={css(styles.modalSection, style)}>
            {label ? <span style={styles.modalSectionLabel}>{label}</span> : null}
            {children}
        </div>
    );
}

export function CommonModal({
    visible,
    title,
    onClose,
    children,
    contentStyle,
}: CommonModalProps): React.JSX.Element | null {
    const { t } = useTranslation();
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    if (!visible) {
        return null;
    }

    return (
        <div role="dialog" aria-label={title}>
            <div style={styles.modalBackdrop} onClick={withTapHaptic(onClose)} aria-label={t('common.closeBackdrop')}>
                <div style={css(styles.modalContainer, contentStyle)} onClick={event => event.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <span style={styles.modalTitleText}>{title}</span>
                        <button
                            type="button"
                            onClick={withTapHaptic(onClose)}
                            aria-label={t('common.closeModal')}
                            style={styles.modalCloseBtn}
                        >
                            <CloseIcon size={26} color={colors.textSecondary} />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}

const createStyles = (colors: ThemeColors) => ({
    modalBackdrop: {
        flex: 1,
        backgroundColor: colors.overlayScrim,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.cardBackground,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
        gap: 20,
        shadowColor: colors.shadowNavy,
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    modalTitleText: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 32,
        color: colors.text,
    },
    modalCloseBtn: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSection: {
        gap: 6,
    },
    modalSectionLabel: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },
});

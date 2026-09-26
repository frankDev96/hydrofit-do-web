import React, { useEffect } from 'react';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { AchievementBadgeIcon, type AchievementBadgeId } from '@common/icons';
import { useTranslation } from '@i18n';
import { CelebrationLayout, Spacing, useColors, useThemedStyles, type ThemeColors } from '@theme';
import { CommonButton } from '../CommonButton/CommonButton';
import { ConfettiBurst } from '../ConfettiBurst/ConfettiBurst';

export type AchievementUnlockedModalProps = {
    visible: boolean;
    badgeId: AchievementBadgeId;
    title: string;
    description: string;
    onClose: () => void;
};

export function AchievementUnlockedModal({
    visible,
    badgeId,
    title,
    description,
    onClose,
}: AchievementUnlockedModalProps): React.JSX.Element | null {
    const { t } = useTranslation();
    const colors = useColors();
    const styles = useThemedStyles(createStyles);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(onClose, CelebrationLayout.autoDismissMs);
        return () => clearTimeout(timer);
    }, [badgeId, onClose, visible]);

    if (!visible) return null;

    return (
        <div role="dialog" aria-label={t('achievements.unlockedA11y', { title, description })} style={styles.root}>
            <button
                type="button"
                aria-label={t('common.closeBackdrop')}
                onClick={withTapHaptic(onClose)}
                style={styles.scrimHit}
            />
            <div style={styles.card}>
                <ConfettiBurst active={visible} />
                <div data-testid="achievement-badge" style={styles.badgeWrap}>
                    <AchievementBadgeIcon id={badgeId} size={CelebrationLayout.badgeIconSize} />
                </div>
                <span style={styles.yay}>{t('achievements.unlockedYay')}</span>
                <span style={{ color: colors.text }}>{title}</span>
                <span style={styles.description}>{description}</span>
                <CommonButton
                    label={t('achievements.unlockedCta')}
                    onPress={onClose}
                    elevated
                    accessibilityLabel={t('achievements.unlockedCta')}
                />
            </div>
        </div>
    );
}

const createStyles = (colors: ThemeColors) => ({
    root: {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 40,
        display: 'grid',
        placeItems: 'center',
    },
    scrimHit: {
        position: 'absolute' as const,
        inset: 0,
        backgroundColor: colors.overlayScrim,
        border: 'none',
    },
    card: {
        position: 'relative' as const,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: 24,
    },
    badgeWrap: {
        display: 'grid',
        placeItems: 'center',
    },
    yay: {
        fontFamily: 'Inter-Bold',
        color: colors.primary,
    },
    description: {
        color: colors.textSecondary,
        textAlign: 'center' as const,
    },
});

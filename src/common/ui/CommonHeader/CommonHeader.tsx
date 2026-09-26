import React from 'react';
import { css, type ImageSource, type StyleProp, type TextStyle, type ViewStyle } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { ArrowBackIcon } from '@common/icons';
import { UserAvatar } from '@common/ui/UserAvatar/UserAvatar';
import { useTranslation } from '@i18n';
import { BorderRadius, IconSize, Spacing, useColors, useThemedStyles, type ThemeColors } from '@theme';

export type CommonHeaderProps = {
    avatarSource?: ImageSource;
    avatarFallback?: ImageSource;
    avatarInitials?: string;
    onAvatarPress?: () => void;
    onAvatarError?: () => void;
    onBack?: () => void;
    leftAction?: React.ReactNode;
    title?: string;
    titleStyle?: StyleProp<TextStyle>;
    onSkip?: () => void;
    rightAction?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

/**
 * Shared TopAppBar / Header component across Onboarding, Walkthrough, and Main tabs.
 * Fixed 3-column slot structure ensures the centered title never shifts or collapses
 * when avatar, skip, or right actions are omitted.
 */
export function CommonHeader({
    avatarSource,
    avatarFallback,
    avatarInitials,
    onAvatarPress,
    onAvatarError,
    onBack,
    leftAction,
    title,
    titleStyle,
    onSkip,
    rightAction,
    style,
}: CommonHeaderProps): React.JSX.Element {
    const { t } = useTranslation();
    const colors = useColors();
    const insets = { top: 0, bottom: 0, left: 0, right: 0 };
    const styles = useThemedStyles(createStyles);
    const resolvedTitle = title ?? t('common.appName');
    const showAvatar = Boolean(avatarSource) || Boolean(avatarInitials?.trim()) || Boolean(avatarFallback);

    const renderLeft = () => {
        if (leftAction) {
            return leftAction;
        }

        if (onBack) {
            return (
                <button
                    type="button"
                    onClick={withTapHaptic(onBack)}
                    aria-label={t('common.goBack')}
                    style={styles.backButton}
                >
                    <ArrowBackIcon size={24} color={colors.text} />
                </button>
            );
        }

        if (!showAvatar) {
            return null;
        }

        const avatarNode = (
            <UserAvatar
                source={avatarSource}
                fallbackSource={avatarFallback}
                initials={avatarInitials}
                onError={onAvatarError}
                size={IconSize.headerAvatar}
            />
        );

        if (onAvatarPress) {
            return (
                <button
                    type="button"
                    onClick={withTapHaptic(onAvatarPress)}
                    aria-label={t('common.userProfile')}
                    style={styles.avatarButton}
                >
                    {avatarNode}
                </button>
            );
        }

        return avatarNode;
    };

    const renderRight = () => {
        if (rightAction) {
            return rightAction;
        }

        if (onSkip) {
            return (
                <button
                    type="button"
                    onClick={withTapHaptic(onSkip)}
                    aria-label={t('common.skip')}
                    style={styles.skipButton}
                >
                    <span style={styles.skipLabel}>{t('common.skip')}</span>
                </button>
            );
        }

        return null;
    };

    return (
        <div style={css(styles.wrap, { paddingTop: insets.top }, style)}>
            <div style={styles.sideSlot}>{renderLeft()}</div>
            <span style={css(styles.title, titleStyle)}>{resolvedTitle}</span>
            <div style={css(styles.sideSlot, styles.rightSlot)}>{renderRight()}</div>
        </div>
    );
}

export default CommonHeader;

const createStyles = (colors: ThemeColors) => ({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'stretch',
        width: '100%',
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xs,
        minHeight: 56,
        backgroundColor: colors.surfaceLight,
    },
    sideSlot: {
        width: IconSize.xxl,
        height: IconSize.avatar,
        flexShrink: 0,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    rightSlot: {
        alignItems: 'flex-end',
    },
    title: {
        flex: 1,
        fontFamily: 'Inter-SemiBold',
        fontSize: 24,
        lineHeight: 32,
        color: colors.onboardingAccent,
        textAlign: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    avatarButton: {
        borderRadius: BorderRadius.full,
    },
    skipButton: {
        padding: Spacing.xs,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipLabel: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        lineHeight: 21,
        textAlign: 'center',
        color: colors.onboardingFaint,
    },
});

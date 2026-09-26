import React from 'react';
import { css } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { HomeTabIcon, PlanTabIcon, ProfileTabIcon, StatsTabIcon } from '@common/icons';
import { useTranslation, type TranslationKey } from '@i18n';
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

export type TabKey = 'Home' | 'Stats' | 'Plan' | 'Profile';

export type BottomNavBarProps = {
    activeTab: TabKey;
    onSelectTab: (tab: TabKey) => void;
};

type TabConfig = {
    key: TabKey;
    labelKey: TranslationKey;
    a11yKey: TranslationKey;
    renderIcon: (color: string, filled: boolean) => React.ReactNode;
};

const TAB_DEFS: TabConfig[] = [
    {
        key: 'Home',
        labelKey: 'tabs.home',
        a11yKey: 'tabs.homeA11y',
        renderIcon: (color, filled) => <HomeTabIcon size={IconSize.check} color={color} filled={filled} />,
    },
    {
        key: 'Stats',
        labelKey: 'tabs.stats',
        a11yKey: 'tabs.statsA11y',
        renderIcon: (color, filled) => <StatsTabIcon size={IconSize.check} color={color} filled={filled} />,
    },
    {
        key: 'Plan',
        labelKey: 'tabs.plan',
        a11yKey: 'tabs.planA11y',
        renderIcon: (color, filled) => <PlanTabIcon size={IconSize.check} color={color} filled={filled} />,
    },
    {
        key: 'Profile',
        labelKey: 'tabs.profile',
        a11yKey: 'tabs.profileA11y',
        renderIcon: (color, filled) => <ProfileTabIcon size={IconSize.check} color={color} filled={filled} />,
    },
];

export function BottomNavBar({ activeTab, onSelectTab }: BottomNavBarProps): React.JSX.Element {
    const { t } = useTranslation();
    const colors = useColors();
    const insets = { bottom: 0 };
    const styles = useThemedStyles(createStyles);

    return (
        <div style={css(styles.container, { paddingBottom: Math.max(insets.bottom, Spacing.md) })}>
            {TAB_DEFS.map(tab => {
                const isActive = activeTab === tab.key;
                const tintColor = isActive ? colors.primary : colors.onboardingMuted;

                return (
                    <button
                        type="button"
                        key={tab.key}
                        onClick={withTapHaptic(() => onSelectTab(tab.key))}
                        aria-current={isActive ? 'page' : undefined}
                        aria-label={t(tab.a11yKey)}
                        style={css(styles.tabItem, isActive && styles.tabItemActive)}
                    >
                        <div style={styles.iconWrap}>{tab.renderIcon(tintColor, isActive)}</div>
                        <span style={css(styles.tabLabel, { color: tintColor })}>{t(tab.labelKey)}</span>
                    </button>
                );
            })}
        </div>
    );
}

export default BottomNavBar;

const createStyles = (colors: ThemeColors) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        minHeight: Spacing.rowLg,
        paddingHorizontal: Spacing.sm,
        paddingTop: Spacing.xs,
        backgroundColor: colors.surfaceAlt,
        borderTopWidth: 1,
        borderTopColor: colors.onboardingBorderMuted,
        borderTopLeftRadius: BorderRadius.md,
        borderTopRightRadius: BorderRadius.md,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: -Spacing.xs },
        shadowOpacity: 0.04,
        shadowRadius: Spacing.lg,
        elevation: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.xs,
        borderRadius: BorderRadius.md,
        minHeight: TouchTarget.compact,
    },
    tabItemActive: {
        backgroundColor: colors.onboardingAccentMuted,
    },
    iconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        height: IconSize.check,
    },
    tabLabel: {
        ...Typography.tabLabel,
        marginTop: Spacing.xs,
    },
});

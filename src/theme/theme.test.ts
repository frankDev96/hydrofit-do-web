import { describe, expect, it } from 'vitest';
import {
    BorderRadius,
    CelebrationLayout,
    Colors,
    DarkColors,
    HudGaugeLayout,
    LightColors,
    TargetHudLayout,
    Spacing,
    Themes,
    Typography,
    AppIconWidgetLayout,
    TipsWidgetLayout,
    WidgetLayout,
} from './index';

describe('theme tokens', () => {
    it('exposes core color, type, and spacing tokens', () => {
        expect(Colors.primary).toBe('#0077ff');
        expect(Colors.success).toBe('#28A745');
        expect(Colors.wakeTimeGlow).toBe('#FFAB91');
        expect(Colors.bedTimeGlow).toBe('#0077ff');
        expect(Colors.onboardingAccent).toBe('#0077ff');
        expect(Colors.onboardingFaint).toBe('#94A3B8');
        expect(Colors.onboardingDotIdle).toBe('#CBD5E1');
        expect(Typography.titleLarge).toBeTruthy();
        expect(Typography.overline).toBeTruthy();
        expect(Typography.statValue).toBeTruthy();
        expect(Typography.achievementTitle).toBeTruthy();
        expect(Typography.achievementDescription).toBeTruthy();
        expect(Typography.widgetChipLabel.fontSize).toBe(12);
        expect(Typography.widgetEmptyLabel.fontSize).toBe(12);
        expect(Typography.widgetIntakeValue.fontSize).toBe(14);
        expect(Typography.widgetIntakeCaption.fontSize).toBe(10);
        expect(Typography.widgetTipsTitle.fontSize).toBe(12);
        expect(Typography.widgetTipsCta.fontSize).toBe(12);
        expect(Typography.bannerTitle.fontSize).toBe(10);
        expect(Typography.bannerSubtitle.fontSize).toBe(8);
        expect(Typography.insightChipLabel.fontSize).toBe(12);
        expect(Typography.calculationStepLabel.fontSize).toBe(14);
        expect(Typography.buttonLabel.includeFontPadding).toBe(false);
        expect(Typography.hudIntakeValue.fontSize).toBe(36);
        expect(Typography.tabLabel).toBeTruthy();
        expect(Typography.timePickerValue.fontSize).toBe(18);
        expect(Typography.articleHeading.fontSize).toBe(16);
        expect(Typography.articleBody.fontSize).toBe(14);
        expect(Spacing.md).toBeGreaterThan(0);
        expect(Spacing.gutter).toBe(12);
        expect(WidgetLayout.columns).toBe(4);
        expect(WidgetLayout.rows).toBe(2);
        expect(WidgetLayout.minWidth).toBe(250);
        expect(WidgetLayout.minHeight).toBe(110);
        expect(WidgetLayout.chipMinWidth).toBe(40);
        expect(WidgetLayout.maxAchievementBadges).toBe(3);
        expect(AppIconWidgetLayout.columns).toBe(2);
        expect(AppIconWidgetLayout.rows).toBe(2);
        expect(AppIconWidgetLayout.minWidth).toBe(110);
        expect(TipsWidgetLayout.columns).toBe(4);
        expect(TipsWidgetLayout.rows).toBe(3);
        expect(TipsWidgetLayout.tipCount).toBe(4);
        expect(HudGaugeLayout.containerElevation).toBe(4);
        expect(HudGaugeLayout.logActionElevation).toBe(10);
        expect(CelebrationLayout.badgeSlotSize).toBe(120);
        expect(CelebrationLayout.badgeIconSize).toBe(72);
        expect(CelebrationLayout.badgeGlowSize).toBe(120);
        expect(TargetHudLayout.tickSpinDurationMs).toBe(18000);
        expect(TargetHudLayout.sizeIncrease).toBe(50);
        expect(LightColors.onboardingStepText).toBe('#334155');
        expect(DarkColors.onboardingStepText).toBe('#E2E8F0');
        expect(CelebrationLayout.pieceCount).toBe(20);
        expect(CelebrationLayout.autoDismissMs).toBe(4000);
        expect(Typography.displayLarge.fontSize).toBe(36);
        expect(LightColors.gaugeTrack).toBe('#E2E8F0');
        expect(DarkColors.gaugeTrack).toBe('#4B5563');
        expect(BorderRadius.full).toBeGreaterThan(0);
        expect(Colors.primaryDeep).toBe('#0058BF');
        expect(Colors.primaryDeepMuted).toBe('#0058BF70');
        expect(Colors.primaryDeepWash).toBe('#0058BF1A');
    });

    it('exposes structured light and dark themes with correct contrast colors', () => {
        expect(Themes.light).toBe(LightColors);
        expect(Themes.dark).toBe(DarkColors);

        // Light mode: pale background, white cards, dark text
        expect(LightColors.background).toBe('#F7F9FC');
        expect(LightColors.surface).toBe('#FFFFFF');
        expect(LightColors.text).toBe('#191C1E');
        expect(LightColors.cardBorder).toBe('#E0E3E6');

        // Dark mode: deep black background, dark charcoal surface, white text
        expect(DarkColors.background).toBe('#121212');
        expect(DarkColors.surface).toBe('#1E1E1E');
        expect(DarkColors.text).toBe('#FFFFFF');
        expect(DarkColors.cardBorder).toBe('#2E3236');
        expect(LightColors.primaryChipBorder).toBeTruthy();
        expect(DarkColors.overlayScrim).toBeTruthy();
        expect(LightColors.nutritionChip).toBeTruthy();
        expect(DarkColors.featuredTagWash).toBeTruthy();
    });
});

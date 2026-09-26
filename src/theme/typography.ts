import { createStyles } from '@/common/css';
import { Colors } from './colors';

/**
 * HydroFit.do Design Tokens — Typography
 * All text styles. No inline fontSize/fontWeight permitted anywhere in the app.
 *
 * Weight lives in the family name, never in `fontWeight`. Android resolves a
 * bold style to `<family>_bold.ttf` in assets/fonts and silently falls back to
 * the system font when that file is absent, so pairing `Inter-Bold` with
 * `fontWeight: '700'` would drop Inter entirely.
 */
export const Typography = createStyles({
    titleLarge: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        color: Colors.white,
    },
    // Large display used on onboarding hero screens (no color so callers can choose light/dark)
    displayLarge: {
        fontSize: 36,
        fontFamily: 'Inter-Bold',
    },
    // Extra large display for numeric readouts
    displayHuge: {
        fontSize: 48,
        fontFamily: 'Inter-Bold',
    },
    /** Calculation ring percent (compact onboarding) */
    calculationPercent: {
        fontSize: 36,
        lineHeight: 40,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: -1.8,
    },
    /** Calculation ring status under percent (CALCULATING / COMPLETE) */
    calculationRingStatus: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Inter-Regular',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    /** Daily-target HUD overline (DAILY TARGET) */
    targetMetricLabel: {
        fontSize: 11,
        lineHeight: 14,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    /** Daily-target HUD numeric value */
    targetMetricValue: {
        fontSize: 40,
        lineHeight: 48,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: -2,
        textAlign: 'center',
        includeFontPadding: false,
    },
    /** Daily-target HUD unit (ml) */
    targetMetricUnit: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        includeFontPadding: false,
    },
    /** Personalized chip on the target HUD */
    targetMetricBadge: {
        fontSize: 11,
        lineHeight: 14,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.2,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    titleMedium: {
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        color: Colors.white,
    },
    /** Centered CommonHeader title on stack screens */
    appBarTitle: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        color: Colors.text,
    },
    /** Primary CTA label on cards / banners */
    buttonLabel: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Inter-Bold',
        includeFontPadding: false,
    },
    body: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.white,
    },
    subtitleLarge: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
    },
    bodySecondary: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.textDim,
    },
    caption: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
        color: Colors.textDim,
    },
    label: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        color: Colors.textDim,
    },
    /** Onboarding stepper caption under each step icon */
    stepperLabel: {
        fontSize: 11,
        lineHeight: 14,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.55,
        textAlign: 'center',
    },
    /** Profile / settings section overline with wider tracking */
    profileSectionLabel: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: Colors.textDim,
    },
    /** Compact semi-bold body for list/row values */
    bodySemiBold: {
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
    },
    /** Emphasized numeric row value (daily target, etc.) */
    valueEmphasis: {
        fontSize: 16,
        fontFamily: 'Inter-Bold',
    },
    /** Compact card overline (stats, similar Figma 12/16 SemiBold) */
    overline: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    /** Calculation checklist step label — sentence case, scannable */
    calculationStepLabel: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0,
        textAlign: 'left',
    },
    /** Screen intro heading (Sora) — reminder sound, similar pickers */
    screenHeading: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: 'Sora-SemiBold',
        color: Colors.text,
        textAlign: 'center',
    },
    /** Screen intro supporting copy */
    screenSubtitle: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    /** Selected row title in sound / option lists */
    listItemTitleSelected: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Inter-SemiBold',
        color: Colors.text,
    },
    /** Idle row title in sound / option lists */
    listItemTitle: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Inter-Regular',
        color: Colors.textSecondary,
    },
    /** Numeric readout using bundled Sora cut */
    statValue: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Sora-SemiBold',
        color: Colors.text,
        textAlign: 'center',
    },
    statUnit: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    /** Compact achievement card title */
    achievementTitle: {
        fontSize: 12,
        fontFamily: 'Inter-Bold',
        color: Colors.text,
        textAlign: 'center',
    },
    /** Compact achievement card description */
    achievementDescription: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Inter-Regular',
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    /** 4×2 home widget millilitre chip */
    widgetChipLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        includeFontPadding: false,
    },
    /** 4×2 home widget empty-achievements hint */
    widgetEmptyLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Regular',
        includeFontPadding: false,
    },
    /** 4×2 home widget today's intake / target */
    widgetIntakeValue: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'Inter-SemiBold',
        includeFontPadding: false,
    },
    /** 4×2 home widget remaining / goal-reached caption */
    widgetIntakeCaption: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Inter-Regular',
        includeFontPadding: false,
    },
    /** Tips home widget row title */
    widgetTipsTitle: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        includeFontPadding: false,
    },
    /** Tips home widget row tag */
    widgetTipsTag: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Inter-Regular',
        includeFontPadding: false,
    },
    /** Tips home widget open-app CTA */
    widgetTipsCta: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        includeFontPadding: false,
    },
    /** Compact permission / info banner title */
    bannerTitle: {
        fontSize: 10,
        lineHeight: 14,
        fontFamily: 'Inter-SemiBold',
        includeFontPadding: false,
    },
    /** Compact permission / info banner supporting copy */
    bannerSubtitle: {
        fontSize: 8,
        lineHeight: 12,
        fontFamily: 'Inter-Regular',
        includeFontPadding: false,
    },
    /** Home HUD logged intake */
    hudIntakeValue: {
        fontSize: 36,
        lineHeight: 40,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
        includeFontPadding: false,
    },
    /** Home HUD "of {n} ml goal" */
    hudGoalCaption: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    /** Home HUD remaining volume */
    hudRemaining: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
        textAlign: 'center',
    },
    /** Home mascot card greeting */
    mascotCardTitle: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: 'Inter-Bold',
    },
    /** Home mascot tips link */
    mascotLink: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.18,
    },
    /** Header streak count */
    streakCount: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-Bold',
    },
    /** Bottom tab label */
    tabLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.6,
    },
    /** Home container-switcher label */
    switcherLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
    },
    /** Compact relative timestamp under notification cards */
    notificationTime: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.6,
    },
    /** Idle time-drum digit */
    drumValue: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
    },
    /** Selected time-drum digit */
    drumValueSelected: {
        fontSize: 22,
        lineHeight: 28,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
    },
    /** Colon between hour and minute drums */
    drumColon: {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: 'Inter-Bold',
    },
    /** AM/PM toggle label on time drums */
    drumPeriod: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    /** Tips screen section heading (Tip of the Day) */
    tipsSectionHeading: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: 'Inter-SemiBold',
        color: Colors.text,
    },
    /** Centered dialog title (Unit preferences, etc.) */
    dialogTitle: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: 'Sora-SemiBold',
    },
    /** Compact dialog action label (Cancel / OK) */
    dialogAction: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0.6,
        textAlign: 'center',
    },
    /** Featured tip card title */
    tipsHeroTitle: {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.72,
    },
    /** Featured tip card body */
    tipsHeroBody: {
        fontSize: 15,
        lineHeight: 22,
        fontFamily: 'Inter-Regular',
    },
    /** Tips list card description */
    tipsCardDescription: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter-Regular',
    },
    /** Tips search field text */
    tipsSearchInput: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Inter-Regular',
    },
    /** Shared time-picker field value */
    timePickerValue: {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: 'Inter-Regular',
    },
    /** Section heading inside legal / help articles */
    articleHeading: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Inter-SemiBold',
    },
    /** Long-form body copy for legal / help articles */
    articleBody: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: 'Inter-Regular',
    },
    /** Initials inside the compact header avatar */
    avatarInitials: {
        fontSize: 14,
        lineHeight: 18,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
    },
    /** Initials inside the large profile avatar */
    avatarInitialsLg: {
        fontSize: 28,
        lineHeight: 32,
        fontFamily: 'Inter-Bold',
        textAlign: 'center',
    },
    /** Calculation insight chip label */
    insightChipLabel: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: 0,
        includeFontPadding: false,
    },
    /** Calculation insight chip value */
    insightChipValue: {
        fontSize: 10,
        lineHeight: 16,
        fontFamily: 'Inter-Bold',
        includeFontPadding: false,
    },
});

/**
 * HydroFit.do Design Tokens — Colors
 * Grouped into Light and Dark theme configurations with full token parity.
 * Single source of truth for all color values (AD-3 shape rule: config → MMKV/theme)
 */

export const LightColors = {
    // Backgrounds & Surfaces (Light theme: crisp whites, pale slate grays)
    background: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceLight: '#F7F9FC',
    surfaceAlt: '#FFFFFF',
    surfaceRaised: '#ECEEF1',
    cardBackground: '#FFFFFF',
    cardBorder: '#E0E3E6',

    // Brand
    primary: '#0077ff', // Cobalt Blue — Hydration
    /** Figma icon fill on compact stats / bio rows */
    primaryDeep: '#0058BF',
    /** Bio-row icon fill — primaryDeep at 70% */
    primaryDeepMuted: '#0058BF70',
    /** Achievement badge wash — primaryDeep at 10% */
    primaryDeepWash: '#0058BF1A',
    accentCyan: '#00D4FF', // Electric Cyan — Workout / active
    accentOrange: '#FF5722', // Sunset Orange — streak / FAB / alerts
    success: '#28A745', // Kelly Green — task completion / goal met

    // Text
    text: '#191C1E',
    textSecondary: '#414755',
    textMuted: '#727786',
    onPrimary: '#FFFFFF',

    // Onboarding / light-theme text and muted colors
    onboardingPrimary: '#0077ff',
    /** Figma accent blue used by time drums, brand wordmark, bedtime glow */
    onboardingAccent: '#0077ff',
    onboardingAccentMuted: 'rgba(0, 119, 255, 0.1)',
    onboardingAccentBorder: 'rgba(0, 119, 255, 0.2)',
    onboardingMuted: '#64748B',
    onboardingMutedDark: '#414755',
    /** Calculation checklist / step copy (slate-700) */
    onboardingStepText: '#334155',
    /** Skip / index label on the plan walkthrough */
    onboardingFaint: '#94A3B8',
    /** Idle pagination dots on the plan walkthrough */
    onboardingDotIdle: '#CBD5E1',
    /** Circular avatar fill on the plan walkthrough header */
    onboardingAvatar: '#E6E8EB',
    /** Muted drum row labels (onboardingMutedDark @ 40%) */
    onboardingIdleText: 'rgba(65, 71, 85, 0.4)',
    onboardingText: '#0F172A',
    onboardingTextStrong: '#191C1E',
    onboardingBorder: '#C1C6D7',
    onboardingBorderMuted: 'rgba(193, 198, 215, 0.3)',
    onboardingToggleTrack: '#ECEEF1',
    /** Soft peach glow behind the wake-time sunrise illustration */
    wakeTimeGlow: '#FFAB91',
    /** Blue glow behind the bedtime illustration */
    bedTimeGlow: '#0077ff',

    // Dividers and UI borders
    divider: '#E1E4E8',
    border: '#C1C6D7',
    /** Soft hairline inside option groups (border @ 20%) */
    borderFaint: 'rgba(193, 198, 215, 0.2)',
    shadow: 'rgba(0, 119, 255, 0.06)',
    /** Centered dialog card elevation (navy @ 12%) */
    dialogShadow: 'rgba(0, 43, 91, 0.12)',
    /** Reminder-sound waveform preview bars (primaryDeep alphas) */
    waveformBarSoft: 'rgba(0, 88, 191, 0.3)',
    waveformBarMuted: 'rgba(0, 88, 191, 0.4)',
    waveformBarMid: 'rgba(0, 88, 191, 0.6)',
    waveformBarStrong: 'rgba(0, 88, 191, 0.8)',

    // Priority indicators (tasks)
    priorityHigh: '#FF5722',
    priorityMedium: '#FFC107',
    priorityLow: '#9E9E9E',

    // Absolute (same in both themes — on-primary text, shadows, illustrations)
    white: '#FFFFFF',
    black: '#000000',

    // Extended UI (moved from hardcoded screen hex)
    textDim: '#9E9E9E',
    rowDivider: '#EAECEF',
    primarySoft: '#E6F0FF',
    controlFill: '#F2F4F7',
    teal: '#00616D',
    tealSoft: '#D1F4F9',
    tealDeep: '#006875',
    primaryBright: '#006FEF',
    primaryChip: '#D6E3FF',
    primaryChipAlt: '#D8E2FF',
    /** Hairline around primaryChip surfaces */
    primaryChipBorder: 'rgba(86, 117, 169, 0.2)',
    /** Dim overlay behind bottom sheets */
    overlayScrim: 'rgba(25, 28, 30, 0.4)',
    surfaceMuted: '#F0F2F5',
    shadowNavy: '#002B5B',
    navyDeep: '#001B3D',
    navy: '#264778',
    error: '#BA1A1A',
    errorDeep: '#93000A',
    errorSoft: '#FFDAD6',
    warning: '#F97316',
    warningDeep: '#EA580C',
    warningSoft: '#FFF7ED',
    iconNavy: '#3D5C8F',
    borderSubtle: '#D1D5DB',
    surfaceSubtle: '#FAFAFA',
    primaryWash: '#F0F6FF',
    primarySelected: '#EAF2FF',
    primaryWashAlt: '#F0F7FF',
    primaryAlpha12: '#0077ff20',
    primaryAlpha19: '#0077ff30',
    chartBar: '#AEC6FF',
    chartBarMuted: '#C5DDFE',
    progressTrack: '#D8DADD',
    /** Unfilled Home HUD ring — stronger than onboardingAvatar on white */
    gaugeTrack: '#E2E8F0',
    cyanBright: '#2EC4B6',
    sky: '#7DD3FC',
    /** Nutrition tip icon wash */
    nutritionChip: 'rgba(156, 240, 255, 0.5)',
    /** Featured tip tag on primary hero */
    featuredTagWash: 'rgba(156, 240, 255, 0.2)',
    featuredTagBorder: 'rgba(156, 240, 255, 0.3)',
    terracotta: '#C45C4A',
    gray200: '#C8CDD4',
    illustrationSkin: '#E8B896',
    illustrationSkinShadow: '#D4A07A',
    illustrationHair: '#1C1C1C',
    illustrationEye: '#1A1A1A',
    illustrationStubble: '#C4A07A',
} as const;

export const DarkColors = {
    // Backgrounds & Surfaces (Dark theme: deep blacks, dark charcoals, raised dark surfaces)
    background: '#121212',
    surface: '#1E1E1E',
    surfaceLight: '#18191B',
    surfaceAlt: '#1E1E1E',
    surfaceRaised: '#2A2A2A',
    cardBackground: '#1E1E1E',
    cardBorder: '#2E3236',

    // Brand
    primary: '#0077ff', // Cobalt Blue — Hydration
    /** Compact icon fill — lighter so it holds on dark surfaces */
    primaryDeep: '#5B9FFF',
    /** Bio-row icon fill — primaryDeep at 70% */
    primaryDeepMuted: 'rgba(91, 159, 255, 0.7)',
    /** Achievement badge wash — primaryDeep at 10% */
    primaryDeepWash: 'rgba(91, 159, 255, 0.1)',
    accentCyan: '#00D4FF', // Electric Cyan — Workout / active
    accentOrange: '#FF5722', // Sunset Orange — streak / FAB / alerts
    success: '#28A745', // Kelly Green — task completion / goal met

    // Text (Dark theme: high-contrast white & silver-gray)
    text: '#FFFFFF',
    textSecondary: '#9E9E9E',
    textMuted: '#8E9199',
    onPrimary: '#FFFFFF',

    // Onboarding / dark-theme text and muted colors
    onboardingPrimary: '#0077ff',
    /** Figma accent blue used by time drums, brand wordmark, bedtime glow */
    onboardingAccent: '#0077ff',
    onboardingAccentMuted: 'rgba(0, 119, 255, 0.2)',
    onboardingAccentBorder: 'rgba(0, 119, 255, 0.35)',
    onboardingMuted: '#94A3B8',
    onboardingMutedDark: '#CBD5E1',
    /** Calculation checklist / step copy */
    onboardingStepText: '#E2E8F0',
    /** Skip / index label on the plan walkthrough */
    onboardingFaint: '#64748B',
    /** Idle pagination dots on the plan walkthrough */
    onboardingDotIdle: '#334155',
    /** Circular avatar fill on the plan walkthrough header */
    onboardingAvatar: '#2A2D34',
    /** Muted drum row labels */
    onboardingIdleText: 'rgba(203, 213, 225, 0.4)',
    onboardingText: '#F8FAFC',
    onboardingTextStrong: '#FFFFFF',
    onboardingBorder: '#3E4452',
    onboardingBorderMuted: 'rgba(62, 68, 82, 0.4)',
    onboardingToggleTrack: '#2A2D34',
    /** Soft peach glow behind the wake-time sunrise illustration */
    wakeTimeGlow: '#FFAB91',
    /** Blue glow behind the bedtime illustration */
    bedTimeGlow: '#0077ff',

    // Dividers and UI borders
    divider: '#2A2D34',
    border: '#333333',
    /** Soft hairline inside option groups */
    borderFaint: 'rgba(62, 68, 82, 0.35)',
    shadow: '#000000',
    /** Centered dialog card elevation */
    dialogShadow: 'rgba(0, 0, 0, 0.35)',
    /** Reminder-sound waveform preview bars */
    waveformBarSoft: 'rgba(91, 159, 255, 0.3)',
    waveformBarMuted: 'rgba(91, 159, 255, 0.4)',
    waveformBarMid: 'rgba(91, 159, 255, 0.6)',
    waveformBarStrong: 'rgba(91, 159, 255, 0.8)',

    // Priority indicators (tasks)
    priorityHigh: '#FF5722',
    priorityMedium: '#FFC107',
    priorityLow: '#616161',

    // Absolute (same in both themes — on-primary text, shadows, illustrations)
    white: '#FFFFFF',
    black: '#000000',

    // Extended UI (moved from hardcoded screen hex)
    textDim: '#9E9E9E',
    rowDivider: '#2A2D34',
    primarySoft: 'rgba(0, 119, 255, 0.25)',
    controlFill: '#2A2D34',
    teal: '#5EEAD4',
    tealSoft: 'rgba(94, 234, 212, 0.2)',
    tealDeep: '#2DD4BF',
    primaryBright: '#3B9EFF',
    primaryChip: 'rgba(0, 119, 255, 0.25)',
    primaryChipAlt: 'rgba(0, 119, 255, 0.3)',
    /** Hairline around primaryChip surfaces */
    primaryChipBorder: 'rgba(147, 197, 253, 0.35)',
    /** Dim overlay behind bottom sheets */
    overlayScrim: 'rgba(0, 0, 0, 0.65)',
    surfaceMuted: '#2A2D34',
    shadowNavy: '#000000',
    navyDeep: '#E2E8F0',
    navy: '#94A3B8',
    error: '#F87171',
    errorDeep: '#FCA5A5',
    errorSoft: 'rgba(186, 26, 26, 0.25)',
    warning: '#F97316',
    warningDeep: '#FB923C',
    warningSoft: 'rgba(249, 115, 22, 0.2)',
    iconNavy: '#93C5FD',
    borderSubtle: '#3E4452',
    surfaceSubtle: '#1E1E1E',
    primaryWash: 'rgba(0, 119, 255, 0.12)',
    primarySelected: 'rgba(0, 119, 255, 0.18)',
    primaryWashAlt: 'rgba(0, 119, 255, 0.1)',
    primaryAlpha12: '#0077ff33',
    primaryAlpha19: '#0077ff4D',
    chartBar: '#60A5FA',
    chartBarMuted: '#1E3A5F',
    progressTrack: '#3E4452',
    /** Unfilled Home HUD ring on dark surfaces */
    gaugeTrack: '#4B5563',
    cyanBright: '#2EC4B6',
    sky: '#7DD3FC',
    /** Nutrition tip icon wash */
    nutritionChip: 'rgba(45, 212, 191, 0.25)',
    /** Featured tip tag on primary hero */
    featuredTagWash: 'rgba(156, 240, 255, 0.2)',
    featuredTagBorder: 'rgba(156, 240, 255, 0.3)',
    terracotta: '#C45C4A',
    gray200: '#C8CDD4',
    illustrationSkin: '#E8B896',
    illustrationSkinShadow: '#D4A07A',
    illustrationHair: '#1C1C1C',
    illustrationEye: '#1A1A1A',
    illustrationStubble: '#C4A07A',
} as const;

export type ThemeMode = 'light' | 'dark';
export type ColorKey = keyof typeof LightColors;
export type ThemeColors = { readonly [K in ColorKey]: string };

export const Themes: Record<ThemeMode, ThemeColors> = {
    light: LightColors,
    dark: DarkColors,
};

/** Default Colors token pointing to default Light theme */
export const Colors = LightColors;

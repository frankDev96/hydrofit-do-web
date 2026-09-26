/**
 * HydroFit.do Design Tokens — Spacing
 * 4dp base grid. Use only these values for margin, padding, gap.
 */
export const Spacing = {
    xs: 4,
    sm: 8,
    /** 12dp — Figma card gutters and compact stacks */
    gutter: 12,
    md: 16,
    /** 20dp — gap between onboarding time drums and footer CTA */
    drumFooterGap: 20,
    lg: 24,
    xl: 32,
    xxl: 48,
    /** Clearance below calculation insight cards */
    insightsClearance: 32,
    xxxl: 80,
    /** 72dp — settings / picker list row touch target */
    rowLg: 72,
} as const;

export const BorderRadius = {
    /** 4dp — compact option / chip corners */
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
} as const;

export const IconSize = {
    xs: 12,
    /** 14dp — compact dialog close glyph */
    closeSm: 14,
    /** 15dp — Figma daily-goal flag width */
    narrow: 15,
    sm: 16,
    /** 17dp — Figma daily-goal flag height */
    tall: 17,
    md: 18,
    lg: 20,
    /** 22dp — selected radio outer ring */
    radioSelected: 22,
    /** 24dp — selected checkmark in list pickers */
    check: 24,
    xl: 32,
    /** 36dp — CommonHeader profile avatar */
    headerAvatar: 36,
    /** 40dp — compact gender-option avatar image */
    avatar: 40,
    xxl: 48,
    /** 64dp — profile achievement badge artwork */
    badge: 64,
    /** 72dp — celebration modal badge (scaled-up unlock moment) */
    celebration: 72,
    xxxl: 80,
} as const;

/** Centered preference dialog layout (Unit modal, etc.) */
export const DialogLayout = {
    maxWidth: 448,
    cardShadowOffsetY: 16,
    cardShadowRadius: 48,
    cardShadowOpacity: 1,
    elevation: 12,
    actionShadowOffsetY: 1,
    actionShadowRadius: 2,
    actionShadowOpacity: 0.05,
} as const;

/** Tips screen layout sizes beyond the 4dp spacing scale */
export const TipsLayout = {
    /** Tip-of-the-day hero card minimum height */
    heroMinHeight: 240,
    /** Soft elevation radius under tip list cards */
    cardShadowRadius: 12,
    /** Soft elevation radius under hero card */
    heroShadowRadius: 48,
} as const;
/**
 * Fixed touch-target heights for primary actions.
 * Prefer these over viewport-% heights so compact phones stay ≥48dp
 * and tablets do not get oversized CTAs (Material / HIG guidance).
 */
export const TouchTarget = {
    /** Absolute minimum — Material 48dp / HIG 44pt floor */
    min: 48,
    /** Compact primary CTA when paired with a secondary text action */
    compact: 52,
    /** Bottom primary CTA (Continue, START, LET'S GO) */
    primary: 56,
} as const;

/** Fixed widths for non-full-width action buttons */
export const ButtonWidth = {
    /** Onboarding footer Continue */
    footerContinue: 166,
} as const;

/**
 * Onboarding form-step layout — heights scale from the pager’s available height
 * so tall 20:9 phones keep drums fully visible above the in-flow footer.
 */
export const OnboardingLayout = {
    headingMaxWidth: 280,
    /** Breadcrumb step tile in the onboarding rail */
    stepBoxWidth: 56,
    stepBoxHeight: 40,
    /** Vertically centers the 2dp connector on stepBoxHeight */
    stepConnectorOffset: 19,
    stepConnectorHeight: 2,
    weightCardMaxHeight: 320,
    weightCardMinHeight: 180,
    weightUnitToggleSpace: 40,
    weightItemHeight: 36,
    weightItemHeightCompact: 28,
    /** Heading + unit toggle + gaps reserved around the weight card */
    weightNonPickerReserve: 140,
    timeDrumMaxHeight: 140,
    timeDrumMinHeight: 96,
    timeItemHeight: 36,
    timeItemHeightCompact: 28,
    timePeriodTrackHeight: 36,
    /** Heading + gaps reserved above the time drum card */
    timeNonPickerReserve: 72,
    timeCardChrome: 64,
} as const;

/** Hydration calculation step — ring geometry and status/insight chrome */
export const CalculationLayout = {
    ringSize: 200,
    ringRadius: 84,
    trackStroke: 6,
    progressStroke: 10,
    progressBarHeight: 6,
    insightCardMinHeight: 72,
    insightIconBadge: IconSize.avatar,
    statusBadgeSize: IconSize.lg,
    skeletonLabelHeight: 12,
    skeletonValueHeight: 16,
    skeletonPulseMs: 900,
    statusShadowOffsetY: 8,
    statusShadowRadius: 16,
    statusShadowOpacity: 0.08,
    statusElevation: 4,
} as const;

/** Daily-target HUD reticle on the post-calculation screen */
export const TargetHudLayout = {
    /** Fraction of screen width for the HUD SVG */
    sizeRatio: 0.68,
    /** Extra size added to the default HUD width and height */
    sizeIncrease: 50,
    /** Inset so the metric stays inside the inner ring */
    centerPadding: Spacing.xl,
    /** One full spin of the outer targeting ticks */
    tickSpinDurationMs: 18000,
    /** One leg of the tick opacity pulse (full cycle is twice this) */
    tickPulseDurationMs: 1600,
    /** Dimest opacity during the tick pulse */
    tickPulseMinOpacity: 0.65,
} as const;

/**
 * Android 4×2 home-screen hydration log widget.
 * Cell mins follow `70 × n − 30` (4×250dp wide, 2×110dp tall).
 */
export const WidgetLayout = {
    columns: 4,
    rows: 2,
    minWidth: 250,
    minHeight: 110,
    padding: Spacing.sm,
    rowGap: Spacing.xs,
    chipGap: Spacing.xs,
    chipCount: 4,
    /** Floor width so "750ml" stays on one line (icon + 4 chips share the row) */
    chipMinWidth: IconSize.avatar,
    achievementRowWeight: 2,
    intakeRowWeight: 3,
    /** Leave room for today's intake summary on the right of the badge row */
    maxAchievementBadges: 3,
} as const;

/** Android 2×2 home-screen app-icon shortcut widget. */
export const AppIconWidgetLayout = {
    columns: 2,
    rows: 2,
    minWidth: 110,
    minHeight: 110,
    iconSize: 72,
} as const;

/** Android 4×3 home-screen tips list widget. */
export const TipsWidgetLayout = {
    columns: 4,
    rows: 3,
    minWidth: 250,
    minHeight: 180,
    padding: Spacing.sm,
    rowGap: Spacing.xs,
    tipCount: 4,
    ctaHeight: 32,
} as const;

/** Full-screen avatar / photo preview */
export const AvatarLayout = {
    /** Diameter of initials when the lightbox has no photo */
    previewSize: 240,
    previewMinScale: 1,
    previewMaxScale: 4,
    previewDoubleTapScale: 2.5,
    previewZoomDurationMs: 200,
    previewZoomStep: 0.5,
    /** Close / zoom glyphs inside the 48dp overlay buttons */
    previewControlIcon: IconSize.lg,
} as const;

/** Achievement-unlock celebration overlay (confetti + badge pop) */
export const CelebrationLayout = {
    pieceCount: 20,
    pieceWidth: Spacing.sm,
    pieceHeight: Spacing.gutter,
    fallDistance: 240,
    pieceStaggerMs: 36,
    fallDurationMs: 1400,
    badgePopDurationMs: 420,
    badgeSettleDurationMs: 180,
    badgePopScale: 1.18,
    /** Soft radial wash behind the badge icon. */
    badgeGlowSize: 120,
    /** Slot larger than the icon so the pop scale stays inside the card. */
    badgeSlotSize: 120,
    badgeIconSize: IconSize.celebration,
    cardElevation: DialogLayout.elevation,
    /** Long enough to read copy and tap the CTA; backdrop still dismisses sooner. */
    autoDismissMs: 4000,
} as const;

/** Stepped cup-size slider (100–500 ml) in the custom container modal. */
export const CustomSizeSliderLayout = {
    trackHeight: Spacing.xs,
    thumbSize: IconSize.lg,
    /** Shifts the thumb so its center sits on the current step. */
    thumbOffset: -(IconSize.lg / 2),
    thumbBorderWidth: 2,
    tickSize: Spacing.xs,
    hitHeight: TouchTarget.min,
} as const;

/** Home Today circular intake gauge */
export const HudGaugeLayout = {
    size: 220,
    strokeWidth: 12,
    switcherSize: TouchTarget.min,
    fillDurationMs: 500,
    dividerWidth: IconSize.xxl,
    switcherShadowOffsetY: Spacing.xs,
    switcherShadowRadius: 6,
    switcherElevation: 3,
    containerShadowOffsetY: Spacing.xs,
    containerShadowRadius: Spacing.sm,
    containerElevation: 4,
    logActionElevation: 10,
    logActionShadowOffsetY: Spacing.sm,
    logActionShadowRadius: Spacing.md,
    logActionShadowOpacity: 0.35,
} as const;

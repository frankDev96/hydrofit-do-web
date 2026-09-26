import type { TranslationKey } from '@i18n';
import type { ProfileAchievementId } from '@modules/hydration/utils/profileAchievements';

/** Content categories (excludes the All filter tab). */
export type TipContentCategory = 'Morning' | 'Workout' | 'Nutrition' | 'Habits';

export type TipIconType = 'morning' | 'workout' | 'habit' | 'nutrition';

export type TipVisibility =
    | { mode: 'always' }
    | { mode: 'afterAchievement'; achievementId: ProfileAchievementId }
    | { mode: 'afterDays'; days: number }
    | { mode: 'recurringUrge'; intervalDays: number };

export type TipDefinition = {
    id: string;
    category: TipContentCategory;
    iconType: TipIconType;
    titleKey: TranslationKey;
    tagKey: TranslationKey;
    descriptionKey: TranslationKey;
    visibility: TipVisibility;
    /** When true, emit inbox + tray the first time the tip becomes visible. */
    notifyOnReveal: boolean;
};

/**
 * Bundled hydration tip catalog (offline). Themes informed by common public
 * hydration guidance; copy is original HydroFit wording.
 */
export const HYDRATION_TIPS_CATALOG: readonly TipDefinition[] = [
    // ── Morning ──────────────────────────────────────────────
    {
        id: 'morning-flush',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningFlushTitle',
        tagKey: 'tips.morningFlushTag',
        descriptionKey: 'tips.morningFlushDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'morning-thirst-lag',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningThirstLagTitle',
        tagKey: 'tips.morningThirstLagTag',
        descriptionKey: 'tips.morningThirstLagDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'morning-urine-check',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningUrineTitle',
        tagKey: 'tips.morningUrineTag',
        descriptionKey: 'tips.morningUrineDescription',
        visibility: { mode: 'afterDays', days: 2 },
        notifyOnReveal: true,
    },
    {
        id: 'morning-before-coffee',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningBeforeCoffeeTitle',
        tagKey: 'tips.morningBeforeCoffeeTag',
        descriptionKey: 'tips.morningBeforeCoffeeDescription',
        visibility: { mode: 'recurringUrge', intervalDays: 2 },
        notifyOnReveal: false,
    },
    // ── Workout ──────────────────────────────────────────────
    {
        id: 'pre-workout',
        category: 'Workout',
        iconType: 'workout',
        titleKey: 'tips.preWorkoutTitle',
        tagKey: 'tips.preWorkoutTag',
        descriptionKey: 'tips.preWorkoutDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'during-workout-sips',
        category: 'Workout',
        iconType: 'workout',
        titleKey: 'tips.duringWorkoutTitle',
        tagKey: 'tips.duringWorkoutTag',
        descriptionKey: 'tips.duringWorkoutDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'post-workout-refill',
        category: 'Workout',
        iconType: 'workout',
        titleKey: 'tips.postWorkoutTitle',
        tagKey: 'tips.postWorkoutTag',
        descriptionKey: 'tips.postWorkoutDescription',
        visibility: { mode: 'afterDays', days: 3 },
        notifyOnReveal: true,
    },
    {
        id: 'workout-sweat-replace',
        category: 'Workout',
        iconType: 'workout',
        titleKey: 'tips.sweatReplaceTitle',
        tagKey: 'tips.sweatReplaceTag',
        descriptionKey: 'tips.sweatReplaceDescription',
        visibility: { mode: 'afterAchievement', achievementId: 'target-smasher' },
        notifyOnReveal: true,
    },
    // ── Nutrition ────────────────────────────────────────────
    {
        id: 'eat-water',
        category: 'Nutrition',
        iconType: 'nutrition',
        titleKey: 'tips.eatWaterTitle',
        tagKey: 'tips.eatWaterTag',
        descriptionKey: 'tips.eatWaterDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'before-meals',
        category: 'Nutrition',
        iconType: 'nutrition',
        titleKey: 'tips.beforeMealsTitle',
        tagKey: 'tips.beforeMealsTag',
        descriptionKey: 'tips.beforeMealsDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'caffeine-balance',
        category: 'Nutrition',
        iconType: 'nutrition',
        titleKey: 'tips.caffeineBalanceTitle',
        tagKey: 'tips.caffeineBalanceTag',
        descriptionKey: 'tips.caffeineBalanceDescription',
        visibility: { mode: 'afterDays', days: 4 },
        notifyOnReveal: true,
    },
    {
        id: 'soup-and-smoothies',
        category: 'Nutrition',
        iconType: 'nutrition',
        titleKey: 'tips.soupSmoothieTitle',
        tagKey: 'tips.soupSmoothieTag',
        descriptionKey: 'tips.soupSmoothieDescription',
        visibility: { mode: 'afterAchievement', achievementId: 'first-drop' },
        notifyOnReveal: true,
    },
    // ── Habits ───────────────────────────────────────────────
    {
        id: 'listen-body',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.listenBodyTitle',
        tagKey: 'tips.listenBodyTag',
        descriptionKey: 'tips.listenBodyDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'desk-glass',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.deskGlassTitle',
        tagKey: 'tips.deskGlassTag',
        descriptionKey: 'tips.deskGlassDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'streak-cue',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.streakCueTitle',
        tagKey: 'tips.streakCueTag',
        descriptionKey: 'tips.streakCueDescription',
        visibility: { mode: 'afterAchievement', achievementId: 'habit-starter' },
        notifyOnReveal: true,
    },
    {
        id: 'evening-taper',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.eveningTaperTitle',
        tagKey: 'tips.eveningTaperTag',
        descriptionKey: 'tips.eveningTaperDescription',
        visibility: { mode: 'afterDays', days: 5 },
        notifyOnReveal: true,
    },
    {
        id: 'benefit-reminder',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.benefitReminderTitle',
        tagKey: 'tips.benefitReminderTag',
        descriptionKey: 'tips.benefitReminderDescription',
        visibility: { mode: 'recurringUrge', intervalDays: 1 },
        notifyOnReveal: false,
    },
    {
        id: 'early-bird-boost',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.earlyBirdBoostTitle',
        tagKey: 'tips.earlyBirdBoostTag',
        descriptionKey: 'tips.earlyBirdBoostDescription',
        visibility: { mode: 'afterAchievement', achievementId: 'early-bird' },
        notifyOnReveal: true,
    },
] as const;

export function tipRevealInboxId(tipId: string): string {
    return `tip:reveal:${tipId}`;
}

export function tipUrgeInboxId(tipId: string, dateKey: string): string {
    return `tip:urge:${tipId}:${dateKey}`;
}

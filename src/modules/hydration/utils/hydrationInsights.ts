import { t } from '@i18n';

export type HydrationIntensity = 'LOW' | 'MODERATE' | 'HIGH';

export type HydrationRecovery = string;

/**
 * Display goal as liters/day from the stored ml target (FR9).
 * e.g. 2310 → "2.3 / day"
 */
export function formatDailyGoalLiters(dailyTargetMl: number): string {
    const liters = dailyTargetMl / 1000;
    const rounded = Math.round(liters * 10) / 10;
    return t('insights.dailyGoalLiters', { liters: rounded.toFixed(1) });
}

/**
 * Derive reminder/plan intensity from the daily target volume.
 * MVP has no sweat/activity inputs yet — tiers track the weight×33 result.
 */
export function deriveHydrationIntensity(dailyTargetMl: number): HydrationIntensity {
    if (dailyTargetMl < 2200) {
        return 'LOW';
    }
    if (dailyTargetMl < 2800) {
        return 'MODERATE';
    }
    return 'HIGH';
}

/**
 * Focus uplift implied by the calculated daily target (weight×33 → ml).
 * MODERATE (e.g. 2310 ml) maps to the Figma default "+15% Focus".
 */
export function deriveEnergyBoost(dailyTargetMl: number): string {
    const intensity = deriveHydrationIntensity(dailyTargetMl);
    switch (intensity) {
        case 'LOW':
            return t('insights.focusLow');
        case 'MODERATE':
            return t('insights.focusModerate');
        case 'HIGH':
            return t('insights.focusHigh');
    }
}

/**
 * Recovery pacing label implied by the calculated daily target.
 * MODERATE maps to the Figma default "Fast Track".
 */
export function deriveRecoveryTrack(dailyTargetMl: number): HydrationRecovery {
    const intensity = deriveHydrationIntensity(dailyTargetMl);
    switch (intensity) {
        case 'LOW':
            return t('insights.recoverySteady');
        case 'MODERATE':
            return t('insights.recoveryFast');
        case 'HIGH':
            return t('insights.recoveryPeak');
    }
}

export type EnvironmentalBoostKind = 'climate' | 'activity';

export type EnvironmentalBoost = {
    id: EnvironmentalBoostKind;
    title: string;
    amountMl: number;
    subtitle: string;
};

/**
 * Climate and activity slices implied by the calculated plan (weight × 33).
 * Live weather bonuses are post-MVP; this uses target intensity only.
 */
export function deriveEnvironmentalBoosts(dailyTargetMl: number, frequencyCount: number): EnvironmentalBoost[] {
    const target = dailyTargetMl > 0 ? dailyTargetMl : 2400;
    const intensity = deriveHydrationIntensity(target);
    const intakes = Math.max(1, frequencyCount);
    const activityMl = roundToTen(target * 0.1875);

    const activity =
        intensity === 'LOW'
            ? { title: t('plan.lightActivity'), reason: t('plan.lightActivityReason', { count: intakes }) }
            : intensity === 'HIGH'
              ? { title: t('plan.peakTraining'), reason: t('plan.peakTrainingReason', { count: intakes }) }
              : { title: t('plan.highActivity'), reason: t('plan.highActivityReason', { count: intakes }) };

    const climateBoost = resolveClimateBoost(target, intensity);

    return [
        {
            id: 'climate',
            title: climateBoost.title,
            amountMl: climateBoost.amountMl,
            subtitle: t('plan.boostSubtitle', { amount: climateBoost.amountMl, reason: climateBoost.reason }),
        },
        {
            id: 'activity',
            title: activity.title,
            amountMl: activityMl,
            subtitle: t('plan.boostSubtitle', { amount: activityMl, reason: activity.reason }),
        },
    ];
}

function resolveClimateBoost(
    target: number,
    intensity: HydrationIntensity,
): { title: string; amountMl: number; reason: string } {
    const amountMl = roundToTen(target * 0.125);
    if (intensity === 'LOW') {
        return { title: t('plan.mildClimate'), amountMl, reason: t('plan.mildClimateReason') };
    }
    if (intensity === 'HIGH') {
        return { title: t('plan.hotClimate'), amountMl, reason: t('plan.hotClimateReason') };
    }
    return { title: t('plan.warmWeather'), amountMl, reason: t('plan.warmWeatherReason') };
}

function roundToTen(value: number): number {
    return Math.max(0, Math.round(value / 10) * 10);
}

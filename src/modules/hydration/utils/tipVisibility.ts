import { toLocalDateKey } from '@common/utils';
import { HYDRATION_TIPS_CATALOG, type TipDefinition } from '@modules/hydration/constants/hydrationTipsCatalog';
import { buildProfileAchievements, type ProfileAchievementId } from './profileAchievements';
import type { StatsIntakeByDate } from './statsAggregation';

const DAY_MS = 24 * 60 * 60 * 1000;

export type TipVisibilityContext = {
    catalog?: readonly TipDefinition[];
    intakeByDate: StatsIntakeByDate | undefined;
    dailyTargetMl: number;
    onboardingCompletedAtMs: number | null;
    revealedTipIds: readonly string[];
    lastUrgeEmittedByTipId: Readonly<Record<string, string>>;
    nowMs?: number;
};

export type TipVisibilityResult = {
    visibleTips: TipDefinition[];
    newlyRevealedTips: TipDefinition[];
    dueUrgeTips: TipDefinition[];
};

function daysSince(startMs: number, nowMs: number): number {
    if (!Number.isFinite(startMs) || startMs <= 0) {
        return 0;
    }
    return Math.floor(Math.max(0, nowMs - startMs) / DAY_MS);
}

function unlockedAchievementIds(
    intakeByDate: StatsIntakeByDate | undefined,
    dailyTargetMl: number,
): Set<ProfileAchievementId> {
    return new Set(
        buildProfileAchievements({ intakeByDate, dailyTargetMl })
            .filter(item => item.unlocked)
            .map(item => item.id),
    );
}

function isTipUnlocked(tip: TipDefinition, unlocked: ReadonlySet<ProfileAchievementId>, daysOnApp: number): boolean {
    switch (tip.visibility.mode) {
        case 'always':
        case 'recurringUrge':
            return true;
        case 'afterAchievement':
            return unlocked.has(tip.visibility.achievementId);
        case 'afterDays':
            return daysOnApp >= tip.visibility.days;
    }
}

function isUrgeDue(
    tip: TipDefinition,
    lastUrgeEmittedByTipId: Readonly<Record<string, string>>,
    todayKey: string,
    nowMs: number,
): boolean {
    if (tip.visibility.mode !== 'recurringUrge') {
        return false;
    }
    const lastKey = lastUrgeEmittedByTipId[tip.id];
    if (!lastKey) {
        return true;
    }
    if (lastKey === todayKey) {
        return false;
    }
    const lastParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(lastKey);
    if (!lastParts) {
        return true;
    }
    const lastDate = new Date(Number(lastParts[1]), Number(lastParts[2]) - 1, Number(lastParts[3]));
    const elapsedDays = daysSince(lastDate.getTime(), nowMs);
    return elapsedDays >= tip.visibility.intervalDays;
}

/** Resolve which catalog tips are visible, newly unlocked, or due for an urge notify. */
export function resolveTipVisibility(ctx: TipVisibilityContext): TipVisibilityResult {
    const catalog = ctx.catalog ?? HYDRATION_TIPS_CATALOG;
    const nowMs = ctx.nowMs ?? Date.now();
    const todayKey = toLocalDateKey(new Date(nowMs));
    const daysOnApp = ctx.onboardingCompletedAtMs ? daysSince(ctx.onboardingCompletedAtMs, nowMs) : 0;
    const unlocked = unlockedAchievementIds(ctx.intakeByDate, ctx.dailyTargetMl);
    const revealed = new Set(ctx.revealedTipIds);

    const visibleTips: TipDefinition[] = [];
    const newlyRevealedTips: TipDefinition[] = [];
    const dueUrgeTips: TipDefinition[] = [];

    for (const tip of catalog) {
        if (!isTipUnlocked(tip, unlocked, daysOnApp)) {
            continue;
        }
        visibleTips.push(tip);

        if (tip.visibility.mode === 'recurringUrge') {
            if (isUrgeDue(tip, ctx.lastUrgeEmittedByTipId, todayKey, nowMs)) {
                dueUrgeTips.push(tip);
            }
            continue;
        }

        if (tip.notifyOnReveal && !revealed.has(tip.id)) {
            newlyRevealedTips.push(tip);
        }
    }

    return { visibleTips, newlyRevealedTips, dueUrgeTips };
}

/** Stable daily hero pick from always + urge tips. */
export function pickTipOfTheDay(visibleTips: readonly TipDefinition[], dateKey: string): TipDefinition | null {
    const pool = visibleTips.filter(tip => tip.visibility.mode === 'always' || tip.visibility.mode === 'recurringUrge');
    if (pool.length === 0) {
        return null;
    }
    let hash = 0;
    for (let i = 0; i < dateKey.length; i += 1) {
        hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
    }
    return pool[hash % pool.length] ?? null;
}

import { parseTimeToMinutes } from '@common/utils';
import { t } from '@i18n';

const MINUTES_PER_DAY = 24 * 60;

export type HydrationPaceKind = 'ahead' | 'behind' | 'onTrack';

export type HydrationPace = {
    kind: HydrationPaceKind;
    percent: number;
    deltaMl: number;
    expectedMl: number;
    chip: string;
    body: string;
};

export type HydrationPaceInput = {
    todayIntakeMl: number;
    dailyTargetMl: number;
    wakeTime: string;
    bedTime: string;
    nowMs?: number;
};

/** True when intake first reaches or crosses 50% of today's target. */
export function didCrossHalfway(prevTodayMl: number, nextTodayMl: number, dailyTargetMl: number): boolean {
    if (!(dailyTargetMl > 0)) {
        return false;
    }
    const halfway = dailyTargetMl / 2;
    return prevTodayMl < halfway && nextTodayMl >= halfway;
}

function elapsedInWakeWindow(
    wakeMinutes: number,
    bedMinutes: number,
    nowMinutes: number,
): {
    elapsed: number;
    total: number;
} {
    let total = bedMinutes - wakeMinutes;
    if (total <= 0) {
        total += MINUTES_PER_DAY;
    }

    let elapsed = nowMinutes - wakeMinutes;
    if (elapsed < 0) {
        elapsed += MINUTES_PER_DAY;
    }
    if (elapsed > total) {
        elapsed = total;
    }
    return { elapsed, total };
}

/** Linear expected intake from wake→bed at `nowMs`. */
export function expectedIntakeByNowMl(
    dailyTargetMl: number,
    wakeTime: string,
    bedTime: string,
    nowMs: number = Date.now(),
): number {
    if (!(dailyTargetMl > 0)) {
        return 0;
    }
    const now = new Date(nowMs);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const { elapsed, total } = elapsedInWakeWindow(
        parseTimeToMinutes(wakeTime),
        parseTimeToMinutes(bedTime),
        nowMinutes,
    );
    if (total <= 0) {
        return 0;
    }
    return Math.round((dailyTargetMl * elapsed) / total);
}

export function describeHydrationPace({
    todayIntakeMl,
    dailyTargetMl,
    wakeTime,
    bedTime,
    nowMs = Date.now(),
}: HydrationPaceInput): HydrationPace {
    const target = dailyTargetMl > 0 ? dailyTargetMl : 0;
    const percent = target > 0 ? Math.min(100, Math.round((todayIntakeMl / target) * 100)) : 0;
    const expectedMl = expectedIntakeByNowMl(target, wakeTime, bedTime, nowMs);
    const deltaMl = todayIntakeMl - expectedMl;
    const kind: HydrationPaceKind = deltaMl > 0 ? 'ahead' : deltaMl < 0 ? 'behind' : 'onTrack';
    const amount = Math.abs(deltaMl);

    if (kind === 'ahead') {
        return {
            kind,
            percent,
            deltaMl,
            expectedMl,
            chip: t('notifications.paceAhead'),
            body: t('notifications.halfwayAhead', { percent, amount }),
        };
    }
    if (kind === 'behind') {
        return {
            kind,
            percent,
            deltaMl,
            expectedMl,
            chip: t('notifications.paceBehind'),
            body: t('notifications.halfwayBehind', { percent, amount }),
        };
    }
    return {
        kind,
        percent,
        deltaMl,
        expectedMl,
        chip: t('notifications.paceOnTrack'),
        body: t('notifications.halfwayOnTrack', { percent }),
    };
}

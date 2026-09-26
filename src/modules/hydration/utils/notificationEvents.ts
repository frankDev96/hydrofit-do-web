import { t, type TranslateFn } from '@i18n';
import { buildProfileAchievements, type ProfileAchievement, type ProfileAchievementId } from './profileAchievements';
import type { StatsIntakeByDate } from './statsAggregation';

export type InboxNotificationKind = 'welcome' | 'achievement' | 'goal' | 'workout' | 'tip' | 'update';

/** Card visual type used by NotificationCard (no drink-reminder inbox cards). */
export type NotificationCardType = 'goal' | 'workout' | 'update' | 'tip';

export const INBOX_ID_WELCOME = 'welcome';
export const INBOX_ID_CURATED_WORKOUT = 'curated:workout';
export const INBOX_ID_CURATED_TIP = 'curated:tip';
export const INBOX_ID_CURATED_UPDATE = 'curated:update';

export function achievementInboxId(id: ProfileAchievementId): string {
    return `achievement:${id}`;
}

export function dailyGoalInboxId(dateKey: string): string {
    return `goal:${dateKey}`;
}

export function dailyHalfwayInboxId(dateKey: string): string {
    return `goal:halfway:${dateKey}`;
}

export function toNotificationCardType(kind: InboxNotificationKind): NotificationCardType {
    switch (kind) {
        case 'welcome':
        case 'update':
            return 'update';
        case 'achievement':
        case 'goal':
            return 'goal';
        case 'workout':
            return 'workout';
        case 'tip':
            return 'tip';
    }
}

/** Achievements that flipped from locked → unlocked since `prevUnlockedIds`. */
export function detectNewlyUnlockedAchievements(
    prevUnlockedIds: ReadonlySet<string> | readonly string[],
    intakeByDate: StatsIntakeByDate | undefined,
    dailyTargetMl: number,
): ProfileAchievementId[] {
    const seen = prevUnlockedIds instanceof Set ? prevUnlockedIds : new Set(prevUnlockedIds);
    return buildProfileAchievements({ intakeByDate, dailyTargetMl })
        .filter(item => item.unlocked && !seen.has(item.id))
        .map(item => item.id);
}

/** Projects the intake map after one more log on `dateKey`. */
export function projectIntakeAfterLog(
    intakeByDate: StatsIntakeByDate | undefined,
    amountMl: number,
    loggedAtMs: number,
    dateKey: string,
): StatsIntakeByDate {
    const existing = intakeByDate?.[dateKey] ?? [];
    return {
        ...(intakeByDate ?? {}),
        [dateKey]: [{ amountMl, loggedAtMs }, ...existing],
    };
}

/** Achievements that this log would unlock, in profile display order. */
export function achievementsUnlockedByLog(
    intakeByDate: StatsIntakeByDate | undefined,
    dailyTargetMl: number,
    amountMl: number,
    loggedAtMs: number,
    dateKey: string,
): ProfileAchievement[] {
    if (amountMl <= 0) {
        return [];
    }
    const prevUnlocked = new Set(
        buildProfileAchievements({ intakeByDate, dailyTargetMl })
            .filter(item => item.unlocked)
            .map(item => item.id),
    );
    const nextIntake = projectIntakeAfterLog(intakeByDate, amountMl, loggedAtMs, dateKey);
    return buildProfileAchievements({ intakeByDate: nextIntake, dailyTargetMl }).filter(
        item => item.unlocked && !prevUnlocked.has(item.id),
    );
}

/** True when intake first reaches or exceeds the daily target. */
export function didHitDailyGoalToday(prevTodayMl: number, nextTodayMl: number, dailyTargetMl: number): boolean {
    const target = dailyTargetMl > 0 ? dailyTargetMl : 2400;
    return prevTodayMl < target && nextTodayMl >= target;
}

export type RelativeTimeBucket =
    | { unit: 'justNow' }
    | { unit: 'minutes'; count: number }
    | { unit: 'hours'; count: number }
    | { unit: 'yesterday' }
    | { unit: 'days'; count: number };

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function getRelativeTimeBucket(createdAtMs: number, nowMs: number = Date.now()): RelativeTimeBucket {
    const delta = Math.max(0, nowMs - createdAtMs);
    if (delta < MINUTE_MS) {
        return { unit: 'justNow' };
    }
    if (delta < HOUR_MS) {
        return { unit: 'minutes', count: Math.floor(delta / MINUTE_MS) };
    }
    if (delta < DAY_MS) {
        return { unit: 'hours', count: Math.floor(delta / HOUR_MS) };
    }
    if (delta < 2 * DAY_MS) {
        return { unit: 'yesterday' };
    }
    return { unit: 'days', count: Math.floor(delta / DAY_MS) };
}

export function formatRelativeTime(
    createdAtMs: number,
    nowMs: number = Date.now(),
    translate: TranslateFn = t,
): string {
    const bucket = getRelativeTimeBucket(createdAtMs, nowMs);
    switch (bucket.unit) {
        case 'justNow':
            return translate('notifications.timeJustNow');
        case 'minutes':
            return translate('notifications.timeMinutes', { count: bucket.count });
        case 'hours':
            return translate('notifications.timeHours', { count: bucket.count });
        case 'yesterday':
            return translate('notifications.timeYesterday');
        case 'days':
            return translate('notifications.timeDays', { count: bucket.count });
    }
}

export type CuratedSeedDraft = {
    id: string;
    kind: Extract<InboxNotificationKind, 'workout' | 'tip' | 'update'>;
    title: string;
    message: string;
};

/** Curated workout / tip cards seeded once into the inbox. */
export function getCuratedSeedNotifications(translate: TranslateFn = t): CuratedSeedDraft[] {
    return [
        {
            id: INBOX_ID_CURATED_WORKOUT,
            kind: 'workout',
            title: translate('notifications.workoutAlertTitle'),
            message: translate('notifications.workoutAlertMessage'),
        },
        {
            id: INBOX_ID_CURATED_TIP,
            kind: 'tip',
            title: translate('notifications.hydrationTipTitle'),
            message: translate('notifications.hydrationTipMessage'),
        },
    ];
}

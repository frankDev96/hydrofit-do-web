import { t } from '@i18n';
import type { TranslationKey } from '@i18n';
import type { StatsIntakeByDate, StatsIntakeLog } from './statsAggregation';

export const HABIT_STARTER_CONSECUTIVE_DAYS = 3;
export const EARLY_BIRD_HOUR = 8;
export const CENTURION_LOG_COUNT = 100;

export const PROFILE_ACHIEVEMENT_IDS = [
    'first-drop',
    'target-smasher',
    'habit-starter',
    'early-bird',
    'centurion',
] as const;

export type ProfileAchievementId = (typeof PROFILE_ACHIEVEMENT_IDS)[number];

export type ProfileAchievement = {
    id: ProfileAchievementId;
    title: string;
    description: string;
    unlocked: boolean;
};

const ACHIEVEMENT_COPY: Record<ProfileAchievementId, { title: TranslationKey; description: TranslationKey }> = {
    'first-drop': {
        title: 'achievements.firstDropTitle',
        description: 'achievements.firstDropDescription',
    },
    'target-smasher': {
        title: 'achievements.targetSmasherTitle',
        description: 'achievements.targetSmasherDescription',
    },
    'habit-starter': {
        title: 'achievements.habitStarterTitle',
        description: 'achievements.habitStarterDescription',
    },
    'early-bird': {
        title: 'achievements.earlyBirdTitle',
        description: 'achievements.earlyBirdDescription',
    },
    centurion: {
        title: 'achievements.centurionTitle',
        description: 'achievements.centurionDescription',
    },
};

export function flattenIntakeLogs(intakeByDate: StatsIntakeByDate | undefined): StatsIntakeLog[] {
    if (!intakeByDate) {
        return [];
    }
    return Object.values(intakeByDate).flatMap(logs => logs ?? []);
}

export function hasFirstDrop(intakeByDate: StatsIntakeByDate | undefined): boolean {
    return flattenIntakeLogs(intakeByDate).some(log => log.amountMl > 0);
}

export function hasSmashedDailyTarget(intakeByDate: StatsIntakeByDate | undefined, dailyTargetMl: number): boolean {
    const target = dailyTargetMl > 0 ? dailyTargetMl : 2400;
    if (!intakeByDate) {
        return false;
    }
    return Object.values(intakeByDate).some(logs => dayTotalMl(logs) >= target);
}

export function maxConsecutiveLoggedDays(intakeByDate: StatsIntakeByDate | undefined): number {
    if (!intakeByDate) {
        return 0;
    }

    const loggedDays = Object.entries(intakeByDate)
        .filter(([, logs]) => dayTotalMl(logs) > 0)
        .map(([key]) => parseDateKey(key))
        .filter((date): date is Date => date !== null)
        .sort((left, right) => left.getTime() - right.getTime());

    if (loggedDays.length === 0) {
        return 0;
    }

    let longest = 1;
    let current = 1;
    for (let index = 1; index < loggedDays.length; index += 1) {
        const previous = loggedDays[index - 1];
        const next = loggedDays[index];
        if (!previous || !next) {
            continue;
        }
        if (isNextCalendarDay(previous, next)) {
            current += 1;
            longest = Math.max(longest, current);
        } else if (previous.getTime() !== next.getTime()) {
            current = 1;
        }
    }
    return longest;
}

export function hasHabitStarter(intakeByDate: StatsIntakeByDate | undefined): boolean {
    return maxConsecutiveLoggedDays(intakeByDate) >= HABIT_STARTER_CONSECUTIVE_DAYS;
}

export function hasEarlyBirdLog(intakeByDate: StatsIntakeByDate | undefined): boolean {
    return flattenIntakeLogs(intakeByDate).some(log => {
        if (log.amountMl <= 0 || !Number.isFinite(log.loggedAtMs)) {
            return false;
        }
        return new Date(log.loggedAtMs).getHours() < EARLY_BIRD_HOUR;
    });
}

export function countIntakeLogs(intakeByDate: StatsIntakeByDate | undefined): number {
    return flattenIntakeLogs(intakeByDate).filter(log => log.amountMl > 0).length;
}

export function hasCenturion(intakeByDate: StatsIntakeByDate | undefined): boolean {
    return countIntakeLogs(intakeByDate) >= CENTURION_LOG_COUNT;
}

export function buildProfileAchievements({
    intakeByDate,
    dailyTargetMl,
}: {
    intakeByDate: StatsIntakeByDate | undefined;
    dailyTargetMl: number;
}): ProfileAchievement[] {
    const unlockedById: Record<ProfileAchievementId, boolean> = {
        'first-drop': hasFirstDrop(intakeByDate),
        'target-smasher': hasSmashedDailyTarget(intakeByDate, dailyTargetMl),
        'habit-starter': hasHabitStarter(intakeByDate),
        'early-bird': hasEarlyBirdLog(intakeByDate),
        centurion: hasCenturion(intakeByDate),
    };

    return PROFILE_ACHIEVEMENT_IDS.map(id => ({
        id,
        title: t(ACHIEVEMENT_COPY[id].title),
        description: t(ACHIEVEMENT_COPY[id].description),
        unlocked: unlockedById[id],
    }));
}

function dayTotalMl(logs: StatsIntakeLog[] | undefined): number {
    if (!logs || logs.length === 0) {
        return 0;
    }
    return logs.reduce((total, log) => total + Math.max(0, log.amountMl), 0);
}

function parseDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) {
        return null;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
        return null;
    }
    return new Date(year, month - 1, day);
}

function isNextCalendarDay(previous: Date, next: Date): boolean {
    const expected = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1);
    return expected.getTime() === next.getTime();
}

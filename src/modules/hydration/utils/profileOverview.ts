import { buildHydrationStats, type StatsIntakeByDate } from './statsAggregation';

/** One level per 750 ml logged — 18.4 L maps to level 24. */
const ML_PER_LEVEL = 750;

export type ProfileOverviewStats = {
    level: number;
    streakDays: number;
    totalLitersLabel: string;
};

export function sumAllIntakeMl(intakeByDate: StatsIntakeByDate | undefined): number {
    if (!intakeByDate) {
        return 0;
    }
    return Object.values(intakeByDate).reduce((total, logs) => {
        return total + logs.reduce((dayTotal, log) => dayTotal + log.amountMl, 0);
    }, 0);
}

export function deriveHydrationLevel(totalMl: number): number {
    const safeTotal = Math.max(0, totalMl);
    return Math.max(1, Math.floor(safeTotal / ML_PER_LEVEL));
}

export function formatTotalLitersLabel(totalMl: number): string {
    return (Math.max(0, totalMl) / 1000).toFixed(1);
}

export function buildProfileOverviewStats({
    intakeByDate,
    dailyTargetMl,
    now = new Date(),
}: {
    intakeByDate: StatsIntakeByDate | undefined;
    dailyTargetMl: number;
    now?: Date;
}): ProfileOverviewStats {
    const totalMl = sumAllIntakeMl(intakeByDate);
    const target = dailyTargetMl > 0 ? dailyTargetMl : 2400;
    const streakDays = buildHydrationStats({
        intakeByDate,
        dailyTargetMl: target,
        timeframe: 'Week',
        now,
    }).consistency.streakDays;

    return {
        level: deriveHydrationLevel(totalMl),
        streakDays,
        totalLitersLabel: formatTotalLitersLabel(totalMl),
    };
}

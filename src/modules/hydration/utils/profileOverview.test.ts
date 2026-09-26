import { describe, expect, it } from 'vitest';
import { toLocalDateKey } from '@common/utils';
import {
    buildProfileOverviewStats,
    deriveHydrationLevel,
    formatTotalLitersLabel,
    sumAllIntakeMl,
} from './profileOverview';

const NOW = new Date(2026, 8, 4, 16, 30);

function dateKey(year: number, monthIndex: number, day: number): string {
    return toLocalDateKey(new Date(year, monthIndex, day));
}

describe('profileOverview', () => {
    it('sums every stored intake log across days', () => {
        const total = sumAllIntakeMl({
            [dateKey(2026, 8, 3)]: [{ amountMl: 10000, loggedAtMs: 1 }],
            [dateKey(2026, 8, 4)]: [
                { amountMl: 5000, loggedAtMs: 2 },
                { amountMl: 3400, loggedAtMs: 3 },
            ],
        });
        expect(total).toBe(18400);
        expect(formatTotalLitersLabel(total)).toBe('18.4');
        expect(deriveHydrationLevel(total)).toBe(24);
    });

    it('starts at level 1 with no logs', () => {
        expect(sumAllIntakeMl({})).toBe(0);
        expect(sumAllIntakeMl(undefined)).toBe(0);
        expect(deriveHydrationLevel(0)).toBe(1);
        expect(formatTotalLitersLabel(0)).toBe('0.0');
    });

    it('uses the 2400 ml fallback target when dailyTargetMl is not positive', () => {
        const stats = buildProfileOverviewStats({
            intakeByDate: undefined,
            dailyTargetMl: 0,
            now: NOW,
        });
        expect(stats.level).toBe(1);
        expect(stats.streakDays).toBe(0);
    });

    it('builds overview stats including a logging streak across two dates', () => {
        const stats = buildProfileOverviewStats({
            intakeByDate: {
                [dateKey(2026, 8, 3)]: [{ amountMl: 250, loggedAtMs: 1 }],
                [dateKey(2026, 8, 4)]: [{ amountMl: 250, loggedAtMs: 2 }],
            },
            dailyTargetMl: 2500,
            now: NOW,
        });

        expect(stats.level).toBe(1);
        expect(stats.streakDays).toBe(2);
        expect(stats.totalLitersLabel).toBe('0.5');
    });
});

import { describe, expect, it } from 'vitest';
import { toLocalDateKey } from '@common/utils';
import { buildHydrationStats, type StatsIntakeByDate, type StatsIntakeLog } from './statsAggregation';

const TARGET = 2500;
const NOW = new Date(2026, 8, 4, 16, 30); // Friday Sep 4, 2026 4:30 PM

function entry(year: number, monthIndex: number, day: number, amountMl: number, hour = 9): StatsIntakeLog {
    return {
        amountMl,
        loggedAtMs: new Date(year, monthIndex, day, hour, 0, 0, 0).getTime(),
    };
}

function records(map: Record<string, StatsIntakeLog[]>): StatsIntakeByDate {
    return map;
}

function dateKey(year: number, monthIndex: number, day: number): string {
    return toLocalDateKey(new Date(year, monthIndex, day));
}

const WEEK_RECORDS = records({
    [dateKey(2026, 7, 24)]: [entry(2026, 7, 24, 2000)],
    [dateKey(2026, 7, 25)]: [entry(2026, 7, 25, 2000)],
    [dateKey(2026, 7, 26)]: [entry(2026, 7, 26, 2000)],
    [dateKey(2026, 7, 27)]: [entry(2026, 7, 27, 2000)],
    [dateKey(2026, 7, 28)]: [entry(2026, 7, 28, 2000)],
    [dateKey(2026, 7, 31)]: [entry(2026, 7, 31, 2200)],
    [dateKey(2026, 8, 1)]: [entry(2026, 8, 1, 2400)],
    [dateKey(2026, 8, 2)]: [entry(2026, 8, 2, 2100)],
    [dateKey(2026, 8, 3)]: [entry(2026, 8, 3, 2600)],
    [dateKey(2026, 8, 4)]: [entry(2026, 8, 4, 800, 8), entry(2026, 8, 4, 1000, 12), entry(2026, 8, 4, 1000, 16)],
});

describe('buildHydrationStats', () => {
    it('builds a daily hourly breakdown for the Day timeframe', () => {
        const stats = buildHydrationStats({
            intakeByDate: WEEK_RECORDS,
            dailyTargetMl: TARGET,
            timeframe: 'Day',
            now: NOW,
        });

        expect(stats.chartTitle).toBe('HOURLY BREAKDOWN');
        expect(stats.chartData).toHaveLength(8);
        expect(stats.chartData.map(bar => bar.day)).toEqual(['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p']);
        expect(stats.chartData.find(bar => bar.day === '6a')?.intakeMl).toBe(800);
        expect(stats.chartData.find(bar => bar.day === '12p')?.intakeMl).toBe(1000);
        expect(stats.chartData.find(bar => bar.day === '3p')?.intakeMl).toBe(1000);
        expect(stats.chartData.find(bar => bar.day === '3p')?.isCurrent).toBe(true);
        expect(stats.summary.overline).toBe("TODAY'S INTAKE");
        expect(stats.summary.valueLabel).toBe('2,800 ml');
        expect(stats.insights.avgIntake).toBe('2.8L');
        expect(stats.insights.goalMetDays).toBe('1/1 Day');
    });

    it('builds a Mon-Sun daily breakdown for the Week timeframe', () => {
        const stats = buildHydrationStats({
            intakeByDate: WEEK_RECORDS,
            dailyTargetMl: TARGET,
            timeframe: 'Week',
            now: NOW,
        });

        expect(stats.chartTitle).toBe('DAILY BREAKDOWN');
        expect(stats.chartData.map(bar => bar.day)).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
        expect(stats.chartData.map(bar => bar.intakeMl)).toEqual([2200, 2400, 2100, 2600, 2800, 0, 0]);
        expect(stats.chartData[4]?.isCurrent).toBe(true);
        expect(stats.summary.overline).toBe('WEEKLY AVG');
        expect(stats.summary.valueLabel).toBe('2,420 ml');
        expect(stats.summary.trendLabel).toBe('+21% VS LAST WK');
        expect(stats.summary.trendDirection).toBe('up');
        expect(stats.insights.avgIntake).toBe('2.4L');
        expect(stats.insights.goalMetDays).toBe('2/5 Days');
        expect(stats.consistency.streakDays).toBe(5);
        expect(stats.consistency.heatmapOpacities).toHaveLength(7);
        expect(stats.consistency.currentIndex).toBe(4);
    });

    it('builds month week-chunks and year month bars', () => {
        const monthStats = buildHydrationStats({
            intakeByDate: WEEK_RECORDS,
            dailyTargetMl: TARGET,
            timeframe: 'Month',
            now: NOW,
        });

        expect(monthStats.chartTitle).toBe('WEEKLY BREAKDOWN');
        expect(monthStats.chartData.map(bar => bar.day)).toEqual(['W1', 'W2', 'W3', 'W4', 'W5']);
        expect(monthStats.chartData[0]?.intakeMl).toBe(9900);
        expect(monthStats.chartData[0]?.isCurrent).toBe(true);
        expect(monthStats.summary.overline).toBe('MONTHLY AVG');
        expect(monthStats.insights.goalMetDays).toBe('2/4 Days');

        const yearStats = buildHydrationStats({
            intakeByDate: WEEK_RECORDS,
            dailyTargetMl: TARGET,
            timeframe: 'Year',
            now: NOW,
        });

        expect(yearStats.chartTitle).toBe('MONTHLY BREAKDOWN');
        expect(yearStats.chartData).toHaveLength(12);
        expect(yearStats.chartData[7]?.day).toBe('A');
        expect(yearStats.chartData[7]?.intakeMl).toBe(12200);
        expect(yearStats.chartData[8]?.day).toBe('S');
        expect(yearStats.chartData[8]?.intakeMl).toBe(9900);
        expect(yearStats.chartData[8]?.isCurrent).toBe(true);
        expect(yearStats.summary.overline).toBe('YEARLY AVG');
    });

    it('handles empty history with zeroed cards and a new-period trend', () => {
        const stats = buildHydrationStats({
            intakeByDate: {},
            dailyTargetMl: TARGET,
            timeframe: 'Week',
            now: NOW,
        });

        expect(stats.chartData.every(bar => bar.intakeMl === 0)).toBe(true);
        expect(stats.summary.valueLabel).toBe('0 ml');
        expect(stats.summary.trendLabel).toBe('0% VS LAST WK');
        expect(stats.summary.trendDirection).toBe('neutral');
        expect(stats.insights.avgIntake).toBe('0.0L');
        expect(stats.insights.goalMetDays).toBe('0/5 Days');
        expect(stats.consistency.streakDays).toBe(0);
    });

    it('marks a downward trend when the previous period was higher', () => {
        const stats = buildHydrationStats({
            intakeByDate: records({
                [dateKey(2026, 8, 3)]: [entry(2026, 8, 3, 3000)],
                [dateKey(2026, 8, 4)]: [entry(2026, 8, 4, 1000)],
            }),
            dailyTargetMl: TARGET,
            timeframe: 'Day',
            now: NOW,
        });

        expect(stats.summary.trendDirection).toBe('down');
        expect(stats.summary.trendLabel).toBe('-67% VS YDAY');
        expect(stats.summary.subtext).toContain('Yesterday');
    });

    it('counts consecutive days with any intake as the streak, even below the daily target', () => {
        const stats = buildHydrationStats({
            intakeByDate: records({
                [dateKey(2026, 8, 3)]: [entry(2026, 8, 3, 250)],
                [dateKey(2026, 8, 4)]: [entry(2026, 8, 4, 250)],
            }),
            dailyTargetMl: TARGET,
            timeframe: 'Week',
            now: NOW,
        });

        expect(stats.insights.goalMetDays).toBe('0/5 Days');
        expect(stats.consistency.streakDays).toBe(2);
    });

    it('starts the logging streak from yesterday when today has no intake', () => {
        const stats = buildHydrationStats({
            intakeByDate: records({
                [dateKey(2026, 8, 2)]: [entry(2026, 8, 2, 250)],
                [dateKey(2026, 8, 3)]: [entry(2026, 8, 3, 250)],
            }),
            dailyTargetMl: TARGET,
            timeframe: 'Week',
            now: NOW,
        });

        expect(stats.consistency.streakDays).toBe(2);
    });

    it('breaks the logging streak on a missed calendar day', () => {
        const stats = buildHydrationStats({
            intakeByDate: records({
                [dateKey(2026, 8, 2)]: [entry(2026, 8, 2, 250)],
                [dateKey(2026, 8, 4)]: [entry(2026, 8, 4, 250)],
            }),
            dailyTargetMl: TARGET,
            timeframe: 'Week',
            now: NOW,
        });

        expect(stats.consistency.streakDays).toBe(1);
    });
});

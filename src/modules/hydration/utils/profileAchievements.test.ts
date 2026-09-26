import { describe, expect, it } from 'vitest';
import type { StatsIntakeByDate } from './statsAggregation';
import {
    buildProfileAchievements,
    countIntakeLogs,
    hasCenturion,
    hasEarlyBirdLog,
    hasFirstDrop,
    hasHabitStarter,
    hasSmashedDailyTarget,
    maxConsecutiveLoggedDays,
} from './profileAchievements';

function at(year: number, monthIndex: number, day: number, hour: number, minute = 0): number {
    return new Date(year, monthIndex, day, hour, minute).getTime();
}

function logs(entries: Array<[amountMl: number, loggedAtMs: number]>): { amountMl: number; loggedAtMs: number }[] {
    return entries.map(([amountMl, loggedAtMs]) => ({ amountMl, loggedAtMs }));
}

describe('profileAchievements', () => {
    it('keeps every badge locked when there is no intake', () => {
        const achievements = buildProfileAchievements({
            intakeByDate: {},
            dailyTargetMl: 2400,
        });

        expect(achievements.map(item => item.title)).toEqual([
            'First Drop',
            'Target Smasher',
            'Habit Starter',
            'Early Bird',
            'Centurion',
        ]);
        expect(achievements.every(item => !item.unlocked)).toBe(true);
        expect(hasFirstDrop(undefined)).toBe(false);
        expect(hasSmashedDailyTarget(undefined, 2400)).toBe(false);
        expect(hasSmashedDailyTarget({ '2026-09-04': [] }, 0)).toBe(false);
        expect(maxConsecutiveLoggedDays(undefined)).toBe(0);
        expect(countIntakeLogs(undefined)).toBe(0);
        expect(hasEarlyBirdLog({ '2026-09-04': logs([[0, at(2026, 8, 4, 7)]]) })).toBe(false);
        expect(maxConsecutiveLoggedDays({ 'not-a-date': logs([[200, at(2026, 8, 1, 12)]]) })).toBe(0);
        expect(
            maxConsecutiveLoggedDays({
                '2026-09-01': logs([[200, at(2026, 8, 1, 12)]]),
                '2026-09-01-dup': logs([[200, at(2026, 8, 1, 12)]]),
                '2026-09-02': logs([[200, at(2026, 8, 2, 12)]]),
            }),
        ).toBe(2);
    });

    it('unlocks First Drop on the first positive log', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-04': logs([[250, at(2026, 8, 4, 10)]]),
        };

        expect(hasFirstDrop(intakeByDate)).toBe(true);
        expect(hasSmashedDailyTarget(intakeByDate, 2400)).toBe(false);
        expect(hasEarlyBirdLog(intakeByDate)).toBe(false);
        expect(hasHabitStarter(intakeByDate)).toBe(false);
        expect(hasCenturion(intakeByDate)).toBe(false);
    });

    it('unlocks Target Smasher when any day meets the daily target', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-04': logs([
                [1200, at(2026, 8, 4, 10)],
                [1200, at(2026, 8, 4, 18)],
            ]),
        };

        expect(hasSmashedDailyTarget(intakeByDate, 2400)).toBe(true);
        expect(hasSmashedDailyTarget(intakeByDate, 2500)).toBe(false);
    });

    it('unlocks Habit Starter after 3 consecutive logged days', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-01': logs([[200, at(2026, 8, 1, 12)]]),
            '2026-09-03': logs([[200, at(2026, 8, 3, 12)]]),
            '2026-09-04': logs([[200, at(2026, 8, 4, 12)]]),
            '2026-09-05': logs([[200, at(2026, 8, 5, 12)]]),
        };

        expect(maxConsecutiveLoggedDays(intakeByDate)).toBe(3);
        expect(hasHabitStarter(intakeByDate)).toBe(true);
    });

    it('does not count a broken streak as Habit Starter', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-01': logs([[200, at(2026, 8, 1, 12)]]),
            '2026-09-03': logs([[200, at(2026, 8, 3, 12)]]),
        };

        expect(hasHabitStarter(intakeByDate)).toBe(false);
    });

    it('unlocks Early Bird when a glass is logged before 8 AM', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-04': logs([[250, at(2026, 8, 4, 7, 45)]]),
        };

        expect(hasEarlyBirdLog(intakeByDate)).toBe(true);
        expect(
            hasEarlyBirdLog({
                '2026-09-04': logs([[250, at(2026, 8, 4, 8)]]),
            }),
        ).toBe(false);
    });

    it('unlocks Centurion at 100 glasses', () => {
        const glasses = Array.from({ length: 100 }, (_, index) => [10, at(2026, 8, 4, 12, index)] as [number, number]);
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-04': logs(glasses),
        };

        expect(countIntakeLogs(intakeByDate)).toBe(100);
        expect(hasCenturion(intakeByDate)).toBe(true);
        expect(
            hasCenturion({
                '2026-09-04': logs(glasses.slice(0, 99)),
            }),
        ).toBe(false);
    });

    it('marks each matching badge unlocked in the gallery model', () => {
        const intakeByDate: StatsIntakeByDate = {
            '2026-09-02': logs([[250, at(2026, 8, 2, 7)]]),
            '2026-09-03': logs([[250, at(2026, 8, 3, 10)]]),
            '2026-09-04': logs([[2500, at(2026, 8, 4, 10)]]),
        };

        const unlocked = buildProfileAchievements({
            intakeByDate,
            dailyTargetMl: 2400,
        })
            .filter(item => item.unlocked)
            .map(item => item.id);

        expect(unlocked).toEqual(['first-drop', 'target-smasher', 'habit-starter', 'early-bird']);
    });
});

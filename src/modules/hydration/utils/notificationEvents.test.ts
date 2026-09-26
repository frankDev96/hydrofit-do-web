import { describe, expect, it } from 'vitest';
import {
    achievementInboxId,
    dailyGoalInboxId,
    dailyHalfwayInboxId,
    achievementsUnlockedByLog,
    detectNewlyUnlockedAchievements,
    didHitDailyGoalToday,
    formatRelativeTime,
    getCuratedSeedNotifications,
    getRelativeTimeBucket,
    INBOX_ID_CURATED_TIP,
    INBOX_ID_CURATED_WORKOUT,
    toNotificationCardType,
} from './notificationEvents';

describe('notificationEvents', () => {
    it('maps inbox kinds to card types without drink reminders', () => {
        expect(toNotificationCardType('welcome')).toBe('update');
        expect(toNotificationCardType('achievement')).toBe('goal');
        expect(toNotificationCardType('goal')).toBe('goal');
        expect(toNotificationCardType('workout')).toBe('workout');
        expect(toNotificationCardType('tip')).toBe('tip');
        expect(toNotificationCardType('update')).toBe('update');
    });

    it('builds stable inbox ids', () => {
        expect(achievementInboxId('first-drop')).toBe('achievement:first-drop');
        expect(dailyGoalInboxId('2026-09-08')).toBe('goal:2026-09-08');
        expect(dailyHalfwayInboxId('2026-09-08')).toBe('goal:halfway:2026-09-08');
    });

    it('detects newly unlocked achievements only', () => {
        const intakeByDate = {
            '2026-09-08': [{ id: '1', amountMl: 250, loggedAtMs: Date.now() }],
        };
        const first = detectNewlyUnlockedAchievements([], intakeByDate, 2000);
        expect(first).toContain('first-drop');

        const again = detectNewlyUnlockedAchievements(['first-drop'], intakeByDate, 2000);
        expect(again).not.toContain('first-drop');
    });

    it('lists achievements a log would unlock', () => {
        const afternoon = Date.parse('2026-09-15T14:00:00');
        const firstGlass = achievementsUnlockedByLog({}, 2000, 250, afternoon, '2026-09-15');
        expect(firstGlass.map(item => item.id)).toEqual(['first-drop']);
        expect(firstGlass[0]?.title).toBe('First Drop');

        const alreadyLogged = {
            '2026-09-15': [{ amountMl: 250, loggedAtMs: afternoon }],
        };
        expect(achievementsUnlockedByLog(alreadyLogged, 2000, 250, afternoon, '2026-09-15')).toEqual([]);
        expect(achievementsUnlockedByLog({}, 2000, 0, afternoon, '2026-09-15')).toEqual([]);

        const nearGoal = achievementsUnlockedByLog(
            { '2026-09-15': [{ amountMl: 1800, loggedAtMs: afternoon }] },
            2000,
            250,
            afternoon,
            '2026-09-15',
        );
        expect(nearGoal.map(item => item.id)).toContain('target-smasher');
    });

    it('detects first daily goal crossing', () => {
        expect(didHitDailyGoalToday(1900, 2100, 2000)).toBe(true);
        expect(didHitDailyGoalToday(2100, 2200, 2000)).toBe(false);
        expect(didHitDailyGoalToday(500, 1500, 2000)).toBe(false);
    });

    it('formats relative time buckets', () => {
        const now = Date.parse('2026-09-08T12:00:00');
        expect(getRelativeTimeBucket(now - 30_000, now)).toEqual({ unit: 'justNow' });
        expect(getRelativeTimeBucket(now - 10 * 60_000, now)).toEqual({ unit: 'minutes', count: 10 });
        expect(getRelativeTimeBucket(now - 2 * 60 * 60_000, now)).toEqual({ unit: 'hours', count: 2 });
        expect(getRelativeTimeBucket(now - 26 * 60 * 60_000, now)).toEqual({ unit: 'yesterday' });
        expect(formatRelativeTime(now - 10 * 60_000, now)).toBe('10m ago');
    });

    it('returns curated workout and tip seeds', () => {
        const seeds = getCuratedSeedNotifications();
        expect(seeds.map(seed => seed.id)).toEqual([INBOX_ID_CURATED_WORKOUT, INBOX_ID_CURATED_TIP]);
        expect(seeds.every(seed => seed.title.length > 0 && seed.message.length > 0)).toBe(true);
    });
});

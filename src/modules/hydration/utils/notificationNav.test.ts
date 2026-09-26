import { describe, expect, it } from 'vitest';
import { buildTrayNavData, parseTipIdFromInboxId, resolveNotificationNav } from './notificationNav';

describe('parseTipIdFromInboxId', () => {
    it('parses reveal and urge ids', () => {
        expect(parseTipIdFromInboxId('tip:reveal:morning-flush')).toBe('morning-flush');
        expect(parseTipIdFromInboxId('tip:urge:benefit-reminder:2026-09-08')).toBe('benefit-reminder');
    });

    it('returns undefined for curated or unrelated ids', () => {
        expect(parseTipIdFromInboxId('curated:tip')).toBeUndefined();
        expect(parseTipIdFromInboxId('welcome')).toBeUndefined();
        expect(parseTipIdFromInboxId('tip:reveal:')).toBeUndefined();
        expect(parseTipIdFromInboxId('tip:urge:')).toBeUndefined();
        expect(parseTipIdFromInboxId('tip:urge:desk-glass')).toBe('desk-glass');
    });
});

describe('resolveNotificationNav', () => {
    it('routes tip payloads to tips with tipId', () => {
        expect(
            resolveNotificationNav({
                nav: 'tips',
                tipId: 'morning-flush',
                inboxId: 'tip:reveal:morning-flush',
            }),
        ).toEqual({ target: 'tips', tipId: 'morning-flush' });
    });

    it('routes achievement payloads to profile', () => {
        expect(
            resolveNotificationNav({
                nav: 'profile',
                achievementId: 'first-drop',
                inboxId: 'achievement:first-drop',
            }),
        ).toEqual({ target: 'profile', achievementId: 'first-drop' });
    });

    it('routes general and missing data to app', () => {
        expect(resolveNotificationNav({ nav: 'app', inboxId: 'welcome' })).toEqual({ target: 'app' });
        expect(resolveNotificationNav(undefined)).toEqual({ target: 'app' });
        expect(resolveNotificationNav({})).toEqual({ target: 'app' });
    });

    it('falls back to inboxId shape when nav is missing', () => {
        expect(resolveNotificationNav({ inboxId: 'tip:urge:desk-glass:2026-09-08' })).toEqual({
            target: 'tips',
            tipId: 'desk-glass',
        });
        expect(resolveNotificationNav({ inboxId: 'achievement:habit-starter' })).toEqual({
            target: 'profile',
            achievementId: 'habit-starter',
        });
        expect(resolveNotificationNav({ inboxId: 'curated:tip' })).toEqual({ target: 'tips' });
        expect(resolveNotificationNav(null)).toEqual({ target: 'app' });
        expect(resolveNotificationNav({ nav: 'tips', inboxId: 'tip:reveal:morning-flush' })).toEqual({
            target: 'tips',
            tipId: 'morning-flush',
        });
        expect(resolveNotificationNav({ nav: 'profile', inboxId: 'achievement:first-drop' })).toEqual({
            target: 'profile',
            achievementId: 'first-drop',
        });
        expect(resolveNotificationNav({ nav: 'profile', achievementId: 'not-real' })).toEqual({
            target: 'profile',
        });
        expect(resolveNotificationNav({ inboxId: 'achievement:not-real' })).toEqual({ target: 'app' });
        expect(resolveNotificationNav({ inboxId: 'tip:reveal:' })).toEqual({ target: 'tips' });
        expect(resolveNotificationNav({ nav: '', inboxId: '' })).toEqual({ target: 'app' });
    });
});

describe('buildTrayNavData', () => {
    it('builds tip, achievement, and general payloads', () => {
        expect(buildTrayNavData({ kind: 'tip', id: 'tip:reveal:morning-flush' })).toEqual({
            nav: 'tips',
            tipId: 'morning-flush',
        });
        expect(
            buildTrayNavData({ kind: 'achievement', id: 'achievement:first-drop', achievementId: 'first-drop' }),
        ).toEqual({
            nav: 'profile',
            achievementId: 'first-drop',
        });
        expect(buildTrayNavData({ kind: 'welcome', id: 'welcome' })).toEqual({ nav: 'app' });
        expect(buildTrayNavData({ kind: 'tip', id: 'curated:tip' })).toEqual({ nav: 'tips' });
        expect(buildTrayNavData({ kind: 'achievement', id: 'achievement:unknown' })).toEqual({ nav: 'profile' });
        expect(buildTrayNavData({ kind: 'achievement', id: 'welcome' })).toEqual({ nav: 'profile' });
    });
});

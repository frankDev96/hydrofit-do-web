import { beforeEach, describe, expect, it } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { mmkvStorage } from './storage';
import { useNotificationInboxStore } from './useNotificationInboxStore';

describe('useNotificationInboxStore', () => {
    beforeEach(() => {
        resetMmkv();
        useNotificationInboxStore.getState().reset();
    });

    it('upserts once and tracks unread count', () => {
        const inserted = useNotificationInboxStore.getState().upsertItem({
            id: 'welcome',
            kind: 'welcome',
            title: 'Welcome',
            message: 'Hello',
            createdAtMs: 1,
        });
        const duplicate = useNotificationInboxStore.getState().upsertItem({
            id: 'welcome',
            kind: 'welcome',
            title: 'Welcome',
            message: 'Hello again',
            createdAtMs: 2,
        });

        expect(inserted).toBe(true);
        expect(duplicate).toBe(false);
        expect(useNotificationInboxStore.getState().items).toHaveLength(1);
        expect(useNotificationInboxStore.getState().getUnreadCount()).toBe(1);

        useNotificationInboxStore.getState().markAllRead();
        expect(useNotificationInboxStore.getState().getUnreadCount()).toBe(0);
    });

    it('records seen achievement ids on achievement upsert', () => {
        useNotificationInboxStore.getState().upsertItem({
            id: 'achievement:first-drop',
            kind: 'achievement',
            achievementId: 'first-drop',
            title: 'Achievement unlocked',
            message: 'First Drop',
            createdAtMs: 1,
        });

        expect(useNotificationInboxStore.getState().seenAchievementIds).toContain('first-drop');
    });

    it('does not duplicate a seen achievement id', () => {
        useNotificationInboxStore.getState().upsertItem({
            id: 'achievement:first-drop',
            kind: 'achievement',
            achievementId: 'first-drop',
            title: 'Achievement unlocked',
            message: 'First Drop',
            createdAtMs: 1,
        });
        useNotificationInboxStore.getState().markAchievementSeen('first-drop');
        useNotificationInboxStore.getState().markAchievementSeen('first-drop');
        expect(useNotificationInboxStore.getState().seenAchievementIds).toEqual(['first-drop']);
    });

    it('marks a single item read and leaves already-read items unchanged', () => {
        useNotificationInboxStore.getState().upsertItem({
            id: 'a',
            kind: 'tip',
            title: 'A',
            message: 'a',
            createdAtMs: 1,
        });
        useNotificationInboxStore.getState().upsertItem({
            id: 'b',
            kind: 'tip',
            title: 'B',
            message: 'b',
            createdAtMs: 2,
            isUnread: false,
        });

        useNotificationInboxStore.getState().markRead('a');
        useNotificationInboxStore.getState().markAllRead();
        expect(useNotificationInboxStore.getState().items.every(item => !item.isUnread)).toBe(true);
        expect(useNotificationInboxStore.getState().getUnreadCount()).toBe(0);
    });

    it('sanitizes persisted inbox rows on rehydrate', async () => {
        mmkvStorage.setItem(
            'hydrofit-notification-inbox',
            JSON.stringify({
                state: {
                    items: [
                        null,
                        { id: '' },
                        { id: 'bad-kind', kind: 'reminder', title: 'x', message: 'y', createdAtMs: 1 },
                        { id: 'bad-title', kind: 'welcome', title: 1, message: 'y', createdAtMs: 1 },
                        { id: 'bad-time', kind: 'welcome', title: 't', message: 'm', createdAtMs: 'nope' },
                        {
                            id: 'ok',
                            kind: 'welcome',
                            title: 'Hello',
                            message: 'There',
                            createdAtMs: 9,
                            isUnread: false,
                            achievementId: 1,
                        },
                        {
                            id: 'ach',
                            kind: 'achievement',
                            title: 'Badge',
                            message: 'First',
                            createdAtMs: 8,
                            achievementId: 'first-drop',
                        },
                    ],
                    seenAchievementIds: [1, 'first-drop'],
                },
                version: 0,
            }),
        );

        await useNotificationInboxStore.persist.rehydrate();

        expect(useNotificationInboxStore.getState().items.map(item => item.id)).toEqual(['ok', 'ach']);
        expect(useNotificationInboxStore.getState().items[0]?.isUnread).toBe(false);
        expect(useNotificationInboxStore.getState().items[1]?.achievementId).toBe('first-drop');
        expect(useNotificationInboxStore.getState().seenAchievementIds).toEqual(['first-drop']);
    });

    it('keeps current inbox state when persisted payload is not an array', async () => {
        useNotificationInboxStore.getState().upsertItem({
            id: 'keep',
            kind: 'tip',
            title: 'Keep',
            message: 'me',
            createdAtMs: 1,
        });
        mmkvStorage.setItem(
            'hydrofit-notification-inbox',
            JSON.stringify({
                state: { items: { nope: true }, seenAchievementIds: 'nope' },
                version: 0,
            }),
        );

        await useNotificationInboxStore.persist.rehydrate();
        expect(useNotificationInboxStore.getState().items.map(item => item.id)).toEqual(['keep']);
    });
});

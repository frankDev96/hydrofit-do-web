import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { InboxNotificationKind } from '@modules/hydration/utils/notificationEvents';
import type { ProfileAchievementId } from '@modules/hydration/utils/profileAchievements';
import { mmkvStorage } from './storage';

export type NotificationInboxItem = {
    id: string;
    kind: InboxNotificationKind;
    achievementId?: ProfileAchievementId;
    title: string;
    message: string;
    createdAtMs: number;
    isUnread: boolean;
};

export type NotificationInboxState = {
    items: NotificationInboxItem[];
    seenAchievementIds: string[];
};

export type NotificationInboxStore = NotificationInboxState & {
    upsertItem: (item: Omit<NotificationInboxItem, 'isUnread'> & { isUnread?: boolean }) => boolean;
    markAllRead: () => void;
    markRead: (id: string) => void;
    markAchievementSeen: (id: ProfileAchievementId) => void;
    getUnreadCount: () => number;
    reset: () => void;
};

const INITIAL_STATE: NotificationInboxState = {
    items: [],
    seenAchievementIds: [],
};

function isInboxKind(value: unknown): value is InboxNotificationKind {
    return (
        value === 'welcome' ||
        value === 'achievement' ||
        value === 'goal' ||
        value === 'workout' ||
        value === 'tip' ||
        value === 'update'
    );
}

function sanitizeItem(raw: unknown): NotificationInboxItem | null {
    if (!raw || typeof raw !== 'object') {
        return null;
    }
    const item = raw as Partial<NotificationInboxItem>;
    if (typeof item.id !== 'string' || !item.id) {
        return null;
    }
    if (!isInboxKind(item.kind)) {
        return null;
    }
    if (typeof item.title !== 'string' || typeof item.message !== 'string') {
        return null;
    }
    if (typeof item.createdAtMs !== 'number' || !Number.isFinite(item.createdAtMs)) {
        return null;
    }
    return {
        id: item.id,
        kind: item.kind,
        achievementId:
            typeof item.achievementId === 'string' ? (item.achievementId as ProfileAchievementId) : undefined,
        title: item.title,
        message: item.message,
        createdAtMs: item.createdAtMs,
        isUnread: item.isUnread !== false,
    };
}

export const useNotificationInboxStore = create<NotificationInboxStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            upsertItem: draft => {
                const existing = get().items.find(item => item.id === draft.id);
                if (existing) {
                    return false;
                }
                const next: NotificationInboxItem = {
                    id: draft.id,
                    kind: draft.kind,
                    achievementId: draft.achievementId,
                    title: draft.title,
                    message: draft.message,
                    createdAtMs: draft.createdAtMs,
                    isUnread: draft.isUnread ?? true,
                };
                set(state => ({
                    items: [next, ...state.items],
                    seenAchievementIds:
                        draft.kind === 'achievement' && draft.achievementId
                            ? state.seenAchievementIds.includes(draft.achievementId)
                                ? state.seenAchievementIds
                                : [...state.seenAchievementIds, draft.achievementId]
                            : state.seenAchievementIds,
                }));
                return true;
            },

            markAllRead: () =>
                set(state => ({
                    items: state.items.map(item => (item.isUnread ? { ...item, isUnread: false } : item)),
                })),

            markRead: id =>
                set(state => ({
                    items: state.items.map(item => (item.id === id ? { ...item, isUnread: false } : item)),
                })),

            markAchievementSeen: id =>
                set(state =>
                    state.seenAchievementIds.includes(id)
                        ? state
                        : { seenAchievementIds: [...state.seenAchievementIds, id] },
                ),

            getUnreadCount: () => get().items.filter(item => item.isUnread).length,

            reset: () => set({ ...INITIAL_STATE }),
        }),
        {
            name: 'hydrofit-notification-inbox',
            storage: createJSONStorage(() => mmkvStorage),
            partialize: state => ({
                items: state.items,
                seenAchievementIds: state.seenAchievementIds,
            }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<NotificationInboxState> | undefined;
                const items = Array.isArray(persisted?.items)
                    ? persisted.items.map(sanitizeItem).filter((item): item is NotificationInboxItem => item !== null)
                    : currentState.items;
                const seenAchievementIds = Array.isArray(persisted?.seenAchievementIds)
                    ? persisted.seenAchievementIds.filter((id): id is string => typeof id === 'string')
                    : currentState.seenAchievementIds;
                return {
                    ...currentState,
                    items,
                    seenAchievementIds,
                };
            },
        },
    ),
);

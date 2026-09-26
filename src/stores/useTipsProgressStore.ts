import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

export type TipsProgressState = {
    revealedTipIds: string[];
    lastUrgeEmittedByTipId: Record<string, string>;
};

export type TipsProgressStore = TipsProgressState & {
    markRevealed: (ids: readonly string[]) => void;
    markUrgeEmitted: (tipId: string, dateKey: string) => void;
    reset: () => void;
};

const INITIAL_STATE: TipsProgressState = {
    revealedTipIds: [],
    lastUrgeEmittedByTipId: {},
};

export const useTipsProgressStore = create<TipsProgressStore>()(
    persist(
        (set, get) => ({
            ...INITIAL_STATE,

            markRevealed: ids => {
                if (ids.length === 0) {
                    return;
                }
                const existing = new Set(get().revealedTipIds);
                let changed = false;
                for (const id of ids) {
                    if (!existing.has(id)) {
                        existing.add(id);
                        changed = true;
                    }
                }
                if (!changed) {
                    return;
                }
                set({ revealedTipIds: [...existing] });
            },

            markUrgeEmitted: (tipId, dateKey) => {
                set(state => ({
                    lastUrgeEmittedByTipId: {
                        ...state.lastUrgeEmittedByTipId,
                        [tipId]: dateKey,
                    },
                }));
            },

            reset: () => set({ ...INITIAL_STATE }),
        }),
        {
            name: 'hydrofit-tips-progress',
            storage: createJSONStorage(() => mmkvStorage),
            partialize: state => ({
                revealedTipIds: state.revealedTipIds,
                lastUrgeEmittedByTipId: state.lastUrgeEmittedByTipId,
            }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<TipsProgressState> | undefined;
                const revealedTipIds = Array.isArray(persisted?.revealedTipIds)
                    ? persisted.revealedTipIds.filter((id): id is string => typeof id === 'string')
                    : currentState.revealedTipIds;
                const lastUrgeEmittedByTipId =
                    persisted?.lastUrgeEmittedByTipId && typeof persisted.lastUrgeEmittedByTipId === 'object'
                        ? Object.fromEntries(
                              Object.entries(persisted.lastUrgeEmittedByTipId).filter(
                                  (entry): entry is [string, string] =>
                                      typeof entry[0] === 'string' && typeof entry[1] === 'string',
                              ),
                          )
                        : currentState.lastUrgeEmittedByTipId;
                return {
                    ...currentState,
                    revealedTipIds,
                    lastUrgeEmittedByTipId,
                };
            },
        },
    ),
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toLocalDateKey } from '@common/utils';
import { AppLifecycleService, WidgetPinService } from '@core';
import { mergeHydrationPersistWithWidgetLogs } from './mergeHydrationWidgetLogs';
import {
    createDefaultReminderSound,
    isReminderSoundSelection,
    type ReminderSoundSelection,
} from '@modules/hydration/utils/reminderSounds';
import { DEFAULT_REMINDER_MODE, isReminderModeId, type ReminderModeId } from '@modules/hydration/utils/reminderModes';
import { createGatedMmkvStorage } from './storage';

export type LocalDateKey = string;

export type CustomContainer = {
    id: string;
    amountMl: number;
};

export type HydrationIntakeLog = {
    id: string;
    amountMl: number;
    loggedAtMs: number;
};

type IntakeByDate = Record<LocalDateKey, HydrationIntakeLog[]>;

const FALLBACK_DEFAULT_SOUND = createDefaultReminderSound('Default');

interface HydrationStore {
    todayIntakeMl: number;
    dailyTargetMl: number;
    selectedContainerMl: number;
    /** Custom cups added from the size modal, oldest first. */
    customContainers: CustomContainer[];
    reminderSound: ReminderSoundSelection;
    reminderMode: ReminderModeId;
    todayKey: LocalDateKey;
    intakeByDate: IntakeByDate;
    todayRecords: HydrationIntakeLog[];
    addIntake: (ml: number, loggedAtMs?: number) => void;
    setDailyTarget: (ml: number) => void;
    setSelectedContainerMl: (ml: number) => void;
    addCustomContainer: (container: CustomContainer) => void;
    removeCustomContainer: (id: string) => void;
    setReminderSound: (sound: ReminderSoundSelection) => void;
    setReminderMode: (mode: ReminderModeId) => void;
    resetForNewDay: () => void;
    reset: () => void;
}

const persistStorage = createGatedMmkvStorage();
const hydrationPersistStorage = {
    ...persistStorage,
    getItem: (name: string) => {
        const value = persistStorage.getItem(name);
        if (value instanceof Promise) {
            return value.then(raw => mergeHydrationPersistWithWidgetLogs(raw, WidgetPinService.peekPendingLogsSync()));
        }
        return mergeHydrationPersistWithWidgetLogs(value, WidgetPinService.peekPendingLogsSync());
    },
};

function sumIntakeMl(records: HydrationIntakeLog[]): number {
    return records.reduce((total, record) => total + record.amountMl, 0);
}

function recordsForDay(intakeByDate: IntakeByDate, dateKey: LocalDateKey): HydrationIntakeLog[] {
    return intakeByDate[dateKey] ?? [];
}

function sessionForDay(intakeByDate: IntakeByDate, dateKey: LocalDateKey) {
    const todayRecords = recordsForDay(intakeByDate, dateKey);
    const todayIntakeMl = sumIntakeMl(todayRecords);
    return { todayKey: dateKey, todayRecords, todayIntakeMl };
}

/**
 * Canonical "today" logs: prefer the non-empty source.
 * Empty `todayRecords: []` must NOT win over `intakeByDate[today]` (?? treats [] as present).
 */
function resolveTodayRecords(
    intakeByDate: IntakeByDate,
    todayKey: LocalDateKey,
    todayRecords: HydrationIntakeLog[] | undefined,
    sessionKey: LocalDateKey,
): HydrationIntakeLog[] {
    const fromBucket = recordsForDay(intakeByDate, todayKey);
    const fromSession = sessionKey === todayKey ? (todayRecords ?? []) : [];
    if (fromBucket.length === 0) {
        return fromSession;
    }
    if (fromSession.length === 0) {
        return fromBucket;
    }
    return sumIntakeMl(fromBucket) >= sumIntakeMl(fromSession) ? fromBucket : fromSession;
}

function mergeIntakeByDate(base: IntakeByDate, overlay: IntakeByDate): IntakeByDate {
    const merged: IntakeByDate = { ...base };
    for (const [dateKey, logs] of Object.entries(overlay)) {
        const existing = merged[dateKey] ?? [];
        if (sumIntakeMl(logs) >= sumIntakeMl(existing)) {
            merged[dateKey] = logs;
        }
    }
    return merged;
}

function promoteLegacyTodayRecords(
    intakeByDate: IntakeByDate,
    todayKey: LocalDateKey,
    sessionKey: LocalDateKey | undefined,
    legacyRecords: HydrationIntakeLog[] | undefined,
): IntakeByDate {
    if (sessionKey !== todayKey || recordsForDay(intakeByDate, todayKey).length || !legacyRecords?.length) {
        return intakeByDate;
    }
    return { ...intakeByDate, [todayKey]: legacyRecords };
}

type LegacyContainerPersist = Partial<HydrationStore> & {
    customContainerMl?: number | null;
};

function isCustomContainer(value: unknown): value is CustomContainer {
    if (typeof value !== 'object' || value == null) {
        return false;
    }
    const candidate = value as { id?: unknown; amountMl?: unknown };
    return typeof candidate.id === 'string' && typeof candidate.amountMl === 'number';
}

function resolveCustomContainers(persisted: LegacyContainerPersist, memory: CustomContainer[]): CustomContainer[] {
    if (Array.isArray(persisted.customContainers)) {
        return persisted.customContainers.filter(isCustomContainer);
    }
    if (typeof persisted.customContainerMl === 'number') {
        return [{ id: 'custom-legacy', amountMl: persisted.customContainerMl }];
    }
    return memory;
}

function applyRehydratedSession(persisted: LegacyContainerPersist): void {
    const todayKey = toLocalDateKey();
    const memory = useHydrationStore.getState();

    // Keep whichever side has more of today's intake so a late rehydrate cannot
    // wipe logs that landed in memory before persist finished (or vice versa).
    let intakeByDate = mergeIntakeByDate(persisted.intakeByDate ?? {}, memory.intakeByDate ?? {});

    // Only promote legacy session logs when they belong to today. Yesterday's
    // persisted todayRecords must not fill intakeByDate[today] after rollover.
    intakeByDate = promoteLegacyTodayRecords(
        intakeByDate,
        todayKey,
        persisted.todayKey ?? memory.todayKey,
        persisted.todayRecords ?? memory.todayRecords,
    );

    const session = sessionForDay(intakeByDate, todayKey);
    const reminderSound = isReminderSoundSelection(persisted.reminderSound)
        ? persisted.reminderSound
        : isReminderSoundSelection(memory.reminderSound)
          ? memory.reminderSound
          : FALLBACK_DEFAULT_SOUND;
    const reminderMode = isReminderModeId(persisted.reminderMode)
        ? persisted.reminderMode
        : isReminderModeId(memory.reminderMode)
          ? memory.reminderMode
          : DEFAULT_REMINDER_MODE;

    useHydrationStore.setState({
        intakeByDate,
        reminderSound,
        reminderMode,
        dailyTargetMl: persisted.dailyTargetMl ?? memory.dailyTargetMl,
        selectedContainerMl: persisted.selectedContainerMl ?? memory.selectedContainerMl,
        customContainers: resolveCustomContainers(persisted, memory.customContainers),
        ...session,
    });
}

export const useHydrationStore = create<HydrationStore>()(
    persist(
        (set, get) => {
            AppLifecycleService.registerResetCallback(() => {
                if (!useHydrationStore.persist.hasHydrated()) {
                    return;
                }
                get().resetForNewDay();
            });

            const todayKey = toLocalDateKey();

            return {
                todayIntakeMl: 0,
                dailyTargetMl: 2310,
                selectedContainerMl: 250,
                customContainers: [],
                reminderSound: FALLBACK_DEFAULT_SOUND,
                reminderMode: DEFAULT_REMINDER_MODE,
                todayKey,
                intakeByDate: {},
                todayRecords: [],

                addIntake: (ml: number, loggedAtMs?: number) => {
                    set(state => {
                        const todayKey = toLocalDateKey();
                        const existing = resolveTodayRecords(
                            state.intakeByDate ?? {},
                            todayKey,
                            state.todayRecords,
                            state.todayKey,
                        );
                        const resolvedAtMs =
                            typeof loggedAtMs === 'number' && Number.isFinite(loggedAtMs) ? loggedAtMs : Date.now();
                        const record: HydrationIntakeLog = {
                            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                            amountMl: ml,
                            loggedAtMs: resolvedAtMs,
                        };
                        const todayRecords = [record, ...existing].sort((a, b) => b.loggedAtMs - a.loggedAtMs);
                        const todayIntakeMl = sumIntakeMl(todayRecords);
                        return {
                            todayKey,
                            todayRecords,
                            todayIntakeMl,
                            intakeByDate: {
                                ...(state.intakeByDate ?? {}),
                                [todayKey]: todayRecords,
                            },
                        };
                    });
                },

                setDailyTarget: (ml: number) => set({ dailyTargetMl: ml }),

                setSelectedContainerMl: (ml: number) => set({ selectedContainerMl: ml }),

                addCustomContainer: (container: CustomContainer) =>
                    set(state => ({ customContainers: [...state.customContainers, container] })),

                removeCustomContainer: (id: string) =>
                    set(state => ({
                        customContainers: state.customContainers.filter(container => container.id !== id),
                    })),

                setReminderSound: (sound: ReminderSoundSelection) => {
                    if (!isReminderSoundSelection(sound)) {
                        return;
                    }
                    set({ reminderSound: sound });
                },

                setReminderMode: (mode: ReminderModeId) => {
                    if (!isReminderModeId(mode)) {
                        return;
                    }
                    set({ reminderMode: mode });
                },

                resetForNewDay: () => {
                    const todayKey = toLocalDateKey();
                    set(sessionForDay(get().intakeByDate ?? {}, todayKey));
                },

                reset: () => {
                    const todayKey = toLocalDateKey();
                    set({
                        todayIntakeMl: 0,
                        dailyTargetMl: 2310,
                        selectedContainerMl: 250,
                        customContainers: [],
                        reminderSound: FALLBACK_DEFAULT_SOUND,
                        reminderMode: DEFAULT_REMINDER_MODE,
                        todayKey,
                        intakeByDate: {},
                        todayRecords: [],
                    });
                },
            };
        },
        {
            name: 'hydrofit-hydration-storage',
            storage: createJSONStorage(() => hydrationPersistStorage),
            partialize: state => ({
                dailyTargetMl: state.dailyTargetMl,
                selectedContainerMl: state.selectedContainerMl,
                customContainers: state.customContainers,
                reminderSound: state.reminderSound,
                reminderMode: state.reminderMode,
                todayIntakeMl: state.todayIntakeMl,
                todayKey: state.todayKey,
                todayRecords: state.todayRecords,
                intakeByDate: state.intakeByDate,
            }),
            merge: (persistedState, currentState) => {
                const persisted = (persistedState ?? {}) as Partial<HydrationStore>;
                let intakeByDate = mergeIntakeByDate(currentState.intakeByDate ?? {}, persisted.intakeByDate ?? {});
                const todayKey = toLocalDateKey();
                intakeByDate = promoteLegacyTodayRecords(
                    intakeByDate,
                    todayKey,
                    persisted.todayKey,
                    persisted.todayRecords,
                );
                const session = sessionForDay(intakeByDate, todayKey);
                return {
                    ...currentState,
                    ...persisted,
                    ...session,
                    intakeByDate,
                };
            },
            onRehydrateStorage: () => (state, error) => {
                persistStorage.enableWrites();
                if (error) {
                    return;
                }
                applyRehydratedSession(state ?? useHydrationStore.getState());
            },
        },
    ),
);

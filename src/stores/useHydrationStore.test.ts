import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toLocalDateKey } from '@common/utils';
import type { ReminderModeId } from '@modules/hydration/utils/reminderModes';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { mmkvStorage } from './storage';
import { useHydrationStore } from './useHydrationStore';

function resetHydrationSession() {
    const todayKey = toLocalDateKey();
    useHydrationStore.setState({
        todayKey,
        intakeByDate: {},
        todayRecords: [],
        todayIntakeMl: 0,
        dailyTargetMl: 2310,
        selectedContainerMl: 250,
        customContainers: [],
        reminderSound: { id: 'default', title: 'Default', url: 'default' },
        reminderMode: 'sound-and-vibrate',
    });
}

describe('useHydrationStore', () => {
    beforeEach(() => {
        resetMmkv();
        resetHydrationSession();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('adds intake toward the daily target and writes through the day bucket', () => {
        useHydrationStore.getState().addIntake(250);
        useHydrationStore.getState().addIntake(500);

        const { todayKey, todayIntakeMl, todayRecords, intakeByDate, dailyTargetMl } = useHydrationStore.getState();
        expect(todayIntakeMl).toBe(750);
        expect(dailyTargetMl).toBe(2310);
        expect(todayRecords).toHaveLength(2);
        expect(todayRecords.map(record => record.amountMl)).toEqual([500, 250]);
        expect(intakeByDate[todayKey]).toEqual(todayRecords);
    });

    it('updates selected container volume', () => {
        useHydrationStore.getState().setSelectedContainerMl(500);
        expect(useHydrationStore.getState().selectedContainerMl).toBe(500);
    });

    it('appends and removes custom containers', () => {
        useHydrationStore.getState().addCustomContainer({ id: 'custom-1', amountMl: 350 });
        useHydrationStore.getState().addCustomContainer({ id: 'custom-2', amountMl: 400 });
        expect(useHydrationStore.getState().customContainers).toEqual([
            { id: 'custom-1', amountMl: 350 },
            { id: 'custom-2', amountMl: 400 },
        ]);

        useHydrationStore.getState().removeCustomContainer('custom-1');
        expect(useHydrationStore.getState().customContainers).toEqual([{ id: 'custom-2', amountMl: 400 }]);
    });

    it('updates reminder sound selection', () => {
        useHydrationStore.getState().setReminderSound({
            id: 'content://media/30',
            title: 'Aldebaran',
            url: 'content://media/30',
        });
        expect(useHydrationStore.getState().reminderSound).toEqual({
            id: 'content://media/30',
            title: 'Aldebaran',
            url: 'content://media/30',
        });
    });

    it('updates reminder mode selection', () => {
        useHydrationStore.getState().setReminderMode('sound-only');
        expect(useHydrationStore.getState().reminderMode).toBe('sound-only');
    });

    it('keeps yesterday intake after a new day reset', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 3, 18, 0));
        resetHydrationSession();

        useHydrationStore.getState().addIntake(250);
        expect(useHydrationStore.getState().todayRecords).toHaveLength(1);

        vi.setSystemTime(new Date(2026, 8, 4, 9, 0));
        useHydrationStore.getState().resetForNewDay();

        const state = useHydrationStore.getState();
        expect(state.todayKey).toBe(toLocalDateKey());
        expect(state.todayIntakeMl).toBe(0);
        expect(state.todayRecords).toHaveLength(0);
    });

    it('accumulates intake for a new day after reset', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 3, 18, 0));
        resetHydrationSession();

        useHydrationStore.getState().addIntake(250);
        vi.setSystemTime(new Date(2026, 8, 4, 9, 0));
        useHydrationStore.getState().resetForNewDay();
        useHydrationStore.getState().addIntake(500);

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(500);
        expect(state.todayRecords).toHaveLength(1);
    });

    it('keeps intake records after setDailyTarget (startup race regression)', async () => {
        useHydrationStore.getState().addIntake(250);
        useHydrationStore.getState().addIntake(500);
        const before = useHydrationStore.getState();
        expect(before.todayIntakeMl).toBe(750);

        // HomeScreen calls this on mount; must not wipe intakeByDate in memory or storage.
        useHydrationStore.getState().setDailyTarget(2000);
        await useHydrationStore.persist.rehydrate();

        const after = useHydrationStore.getState();
        expect(after.dailyTargetMl).toBe(2000);
        expect(after.todayIntakeMl).toBe(750);
        expect(after.todayRecords).toHaveLength(2);
        expect(after.intakeByDate[after.todayKey]).toHaveLength(2);
    });

    it('appends to intakeByDate when todayRecords is an empty array (under-target reopen bug)', () => {
        const todayKey = toLocalDateKey();
        const existing = [{ id: 'kept', amountMl: 500, loggedAtMs: Date.now() }];
        useHydrationStore.setState({
            todayKey,
            // Empty array is truthy for ?? — old addIntake dropped bucket logs because of this.
            todayRecords: [],
            todayIntakeMl: 500,
            intakeByDate: { [todayKey]: existing },
            dailyTargetMl: 2000,
        });

        useHydrationStore.getState().addIntake(250);

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(750);
        expect(state.todayRecords.map(r => r.amountMl)).toEqual([250, 500]);
        expect(state.intakeByDate[todayKey].map(r => r.amountMl)).toEqual([250, 500]);
    });

    it('stores a caller-provided intake timestamp and keeps newest-first order', () => {
        const morning = new Date(2026, 8, 11, 8, 15).getTime();
        const afternoon = new Date(2026, 8, 11, 14, 30).getTime();

        useHydrationStore.getState().addIntake(250, afternoon);
        useHydrationStore.getState().addIntake(500, morning);

        const { todayRecords } = useHydrationStore.getState();
        expect(todayRecords.map(record => record.amountMl)).toEqual([250, 500]);
        expect(todayRecords[0]?.loggedAtMs).toBe(afternoon);
        expect(todayRecords[1]?.loggedAtMs).toBe(morning);
    });

    it('uses Date.now when the logged timestamp is not a finite number', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 11, 10, 0));
        resetHydrationSession();

        useHydrationStore.getState().addIntake(250, Number.NaN);

        expect(useHydrationStore.getState().todayRecords[0]?.loggedAtMs).toBe(new Date(2026, 8, 11, 10, 0).getTime());
    });

    it('ignores stale session records when todayKey does not match the calendar day', () => {
        useHydrationStore.setState({
            todayKey: '2000-01-01',
            todayRecords: [{ id: 'stale', amountMl: 999, loggedAtMs: 1 }],
            todayIntakeMl: 999,
            intakeByDate: {},
        });

        useHydrationStore.getState().addIntake(250);

        const state = useHydrationStore.getState();
        expect(state.todayRecords.map(record => record.amountMl)).toEqual([250]);
        expect(state.todayIntakeMl).toBe(250);
    });

    it('prefers the larger of session vs bucket logs when both are present', () => {
        const todayKey = toLocalDateKey();
        useHydrationStore.setState({
            todayKey,
            todayRecords: [{ id: 'session', amountMl: 100, loggedAtMs: 1 }],
            intakeByDate: { [todayKey]: [{ id: 'bucket', amountMl: 500, loggedAtMs: 1 }] },
        });
        useHydrationStore.getState().addIntake(50);
        expect(useHydrationStore.getState().todayRecords.map(record => record.amountMl)).toEqual([50, 500]);

        useHydrationStore.setState({
            todayKey,
            todayRecords: [{ id: 'session-high', amountMl: 800, loggedAtMs: 1 }],
            intakeByDate: { [todayKey]: [{ id: 'bucket-low', amountMl: 100, loggedAtMs: 1 }] },
        });
        useHydrationStore.getState().addIntake(25);
        expect(useHydrationStore.getState().todayRecords.map(record => record.amountMl)).toEqual([25, 800]);
    });

    it('rejects invalid reminder sound and mode payloads', () => {
        const before = useHydrationStore.getState().reminderSound;
        useHydrationStore.getState().setReminderSound({ id: '', title: 'x', url: 'y' });
        expect(useHydrationStore.getState().reminderSound).toEqual(before);

        useHydrationStore.getState().setReminderMode('not-a-mode' as ReminderModeId);
        expect(useHydrationStore.getState().reminderMode).toBe('sound-and-vibrate');
    });

    it('rehydrates by merging buckets and falling back to memory reminder fields', async () => {
        const todayKey = toLocalDateKey();
        useHydrationStore.setState({
            todayKey,
            todayRecords: [{ id: 'memory', amountMl: 400, loggedAtMs: 2 }],
            todayIntakeMl: 400,
            intakeByDate: { [todayKey]: [{ id: 'memory', amountMl: 400, loggedAtMs: 2 }] },
            reminderSound: { id: 'default', title: 'Default', url: 'default' },
            reminderMode: 'sound-only',
            dailyTargetMl: 2310,
            selectedContainerMl: 250,
        });

        mmkvStorage.setItem(
            'hydrofit-hydration-storage',
            JSON.stringify({
                state: {
                    intakeByDate: { [todayKey]: [{ id: 'disk', amountMl: 100, loggedAtMs: 1 }] },
                    todayRecords: [{ id: 'legacy', amountMl: 50, loggedAtMs: 1 }],
                    reminderSound: { id: '', title: '', url: '' },
                    reminderMode: 'nope',
                    dailyTargetMl: 2000,
                    selectedContainerMl: 500,
                },
                version: 0,
            }),
        );

        await useHydrationStore.persist.rehydrate();

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(400);
        expect(state.dailyTargetMl).toBe(2000);
        expect(state.selectedContainerMl).toBe(500);
        expect(state.reminderSound).toEqual({ id: 'default', title: 'Default', url: 'default' });
        expect(state.reminderMode).toBe('sound-and-vibrate');
    });

    it('promotes persisted day-bucket logs on rehydrate', async () => {
        const todayKey = toLocalDateKey();
        resetHydrationSession();
        mmkvStorage.setItem(
            'hydrofit-hydration-storage',
            JSON.stringify({
                state: {
                    todayKey,
                    intakeByDate: { [todayKey]: [{ id: 'legacy', amountMl: 750, loggedAtMs: 9 }] },
                    todayRecords: [{ id: 'legacy', amountMl: 750, loggedAtMs: 9 }],
                    reminderSound: { id: 'content://media/30', title: 'Aldebaran', url: 'content://media/30' },
                    reminderMode: 'vibrate-only',
                },
                version: 0,
            }),
        );

        await useHydrationStore.persist.rehydrate();

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(750);
        expect(state.intakeByDate[todayKey]?.[0]?.id).toBe('legacy');
        expect(state.reminderSound.title).toBe('Aldebaran');
        expect(state.reminderMode).toBe('vibrate-only');
    });

    it('does not promote yesterday session records into today on rehydrate', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 4, 9, 0));
        resetHydrationSession();

        const yesterdayKey = '2026-09-03';
        const todayKey = toLocalDateKey();
        const yesterdayLogs = [{ id: 'yesterday', amountMl: 900, loggedAtMs: Date.parse('2026-09-03T18:00:00') }];

        mmkvStorage.setItem(
            'hydrofit-hydration-storage',
            JSON.stringify({
                state: {
                    todayKey: yesterdayKey,
                    todayIntakeMl: 900,
                    todayRecords: yesterdayLogs,
                    intakeByDate: { [yesterdayKey]: yesterdayLogs },
                    dailyTargetMl: 2310,
                    selectedContainerMl: 250,
                },
                version: 0,
            }),
        );

        await useHydrationStore.persist.rehydrate();

        const state = useHydrationStore.getState();
        expect(state.todayKey).toBe(todayKey);
        expect(state.todayIntakeMl).toBe(0);
        expect(state.todayRecords).toHaveLength(0);
        expect(state.intakeByDate[todayKey] ?? []).toHaveLength(0);
        expect(state.intakeByDate[yesterdayKey]?.[0]?.id).toBe('yesterday');
    });

    it('promotes same-day legacy todayRecords when the day bucket is empty', async () => {
        const todayKey = toLocalDateKey();
        resetHydrationSession();
        mmkvStorage.setItem(
            'hydrofit-hydration-storage',
            JSON.stringify({
                state: {
                    todayKey,
                    todayRecords: [{ id: 'session-only', amountMl: 400, loggedAtMs: 3 }],
                    todayIntakeMl: 400,
                    intakeByDate: {},
                },
                version: 0,
            }),
        );

        await useHydrationStore.persist.rehydrate();

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(400);
        expect(state.intakeByDate[todayKey]?.[0]?.id).toBe('session-only');
    });

    it('keeps stored intake when there is no home-screen widget queue', async () => {
        const todayKey = toLocalDateKey();
        mmkvStorage.setItem(
            'hydrofit-hydration-storage',
            JSON.stringify({
                state: {
                    dailyTargetMl: 2310,
                    todayKey,
                    todayIntakeMl: 0,
                    todayRecords: [],
                    intakeByDate: {},
                },
                version: 0,
            }),
        );

        await useHydrationStore.persist.rehydrate();

        const state = useHydrationStore.getState();
        expect(state.todayIntakeMl).toBe(0);
        expect(state.todayRecords).toEqual([]);
        expect(state.intakeByDate[todayKey] ?? []).toEqual([]);
    });
});

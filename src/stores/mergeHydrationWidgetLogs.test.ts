import { describe, expect, it } from 'vitest';
import { toLocalDateKey } from '@common/utils';
import { mergeHydrationPersistWithWidgetLogs } from './mergeHydrationWidgetLogs';

describe('mergeHydrationPersistWithWidgetLogs', () => {
    it('returns the original payload when nothing is queued', () => {
        expect(mergeHydrationPersistWithWidgetLogs(null, [])).toBeNull();
        expect(mergeHydrationPersistWithWidgetLogs('{"state":{}}', [])).toBe('{"state":{}}');
    });

    it('creates today logs when persist is empty', () => {
        const todayKey = toLocalDateKey();
        const merged = mergeHydrationPersistWithWidgetLogs(null, [{ amountMl: 250, loggedAtMs: 9 }]);
        expect(merged).toBeTruthy();
        const parsed = JSON.parse(merged ?? '') as {
            state: {
                todayKey: string;
                todayIntakeMl: number;
                todayRecords: Array<{ amountMl: number; loggedAtMs: number; id: string }>;
            };
        };
        expect(parsed.state.todayKey).toBe(todayKey);
        expect(parsed.state.todayIntakeMl).toBe(250);
        expect(parsed.state.todayRecords).toEqual([{ id: 'widget-9-250', amountMl: 250, loggedAtMs: 9 }]);
    });

    it('appends queued presets without duplicating the same tap', () => {
        const todayKey = toLocalDateKey();
        const raw = JSON.stringify({
            state: {
                dailyTargetMl: 2310,
                todayKey,
                todayIntakeMl: 150,
                todayRecords: [{ id: 'keep', amountMl: 150, loggedAtMs: 1 }],
                intakeByDate: { [todayKey]: [{ id: 'keep', amountMl: 150, loggedAtMs: 1 }] },
            },
            version: 0,
        });
        const merged = mergeHydrationPersistWithWidgetLogs(raw, [
            { amountMl: 150, loggedAtMs: 1 },
            { amountMl: 500, loggedAtMs: 4 },
            { amountMl: 99, loggedAtMs: 8 },
        ]);
        const parsed = JSON.parse(merged ?? '') as {
            state: { todayIntakeMl: number; todayRecords: Array<{ amountMl: number }>; dailyTargetMl: number };
        };
        expect(parsed.state.dailyTargetMl).toBe(2310);
        expect(parsed.state.todayIntakeMl).toBe(650);
        expect(parsed.state.todayRecords.map(record => record.amountMl)).toEqual([500, 150]);
    });
});

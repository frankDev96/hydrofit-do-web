import { beforeEach, describe, expect, it } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { mmkvStorage } from './storage';
import { useTipsProgressStore } from './useTipsProgressStore';

describe('useTipsProgressStore', () => {
    beforeEach(() => {
        resetMmkv();
        useTipsProgressStore.getState().reset();
    });

    it('records newly revealed tip ids and ignores empty or duplicate batches', () => {
        useTipsProgressStore.getState().markRevealed([]);
        expect(useTipsProgressStore.getState().revealedTipIds).toEqual([]);

        useTipsProgressStore.getState().markRevealed(['morning-flush', 'desk-glass']);
        useTipsProgressStore.getState().markRevealed(['morning-flush']);

        expect(useTipsProgressStore.getState().revealedTipIds).toEqual(['morning-flush', 'desk-glass']);
    });

    it('records the last urge emission date per tip', () => {
        useTipsProgressStore.getState().markUrgeEmitted('morning-flush', '2026-09-11');
        expect(useTipsProgressStore.getState().lastUrgeEmittedByTipId['morning-flush']).toBe('2026-09-11');
    });

    it('rehydrates string tip ids and urge dates', async () => {
        mmkvStorage.setItem(
            'hydrofit-tips-progress',
            JSON.stringify({
                state: {
                    revealedTipIds: ['ok', 12, null],
                    lastUrgeEmittedByTipId: { 'morning-flush': '2026-09-11', bad: 3 },
                },
                version: 0,
            }),
        );

        await useTipsProgressStore.persist.rehydrate();

        expect(useTipsProgressStore.getState().revealedTipIds).toEqual(['ok']);
        expect(useTipsProgressStore.getState().lastUrgeEmittedByTipId).toEqual({ 'morning-flush': '2026-09-11' });
    });

    it('keeps current tip progress when persisted payloads are the wrong type', async () => {
        useTipsProgressStore.getState().markRevealed(['keep']);
        useTipsProgressStore.getState().markUrgeEmitted('keep', '2026-09-01');
        mmkvStorage.setItem(
            'hydrofit-tips-progress',
            JSON.stringify({
                state: {
                    revealedTipIds: { nope: true },
                    lastUrgeEmittedByTipId: 'nope',
                },
                version: 0,
            }),
        );

        await useTipsProgressStore.persist.rehydrate();
        expect(useTipsProgressStore.getState().revealedTipIds).toEqual(['keep']);
        expect(useTipsProgressStore.getState().lastUrgeEmittedByTipId).toEqual({ keep: '2026-09-01' });
    });
});

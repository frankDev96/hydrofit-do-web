import { describe, expect, it } from 'vitest';
import { buildReminderSlots, resolveNextReminderMinutes } from './nextReminder';

function localMs(hours: number, minutes: number, dayOffset = 0): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hours, minutes, 0, 0).getTime();
}

describe('buildReminderSlots', () => {
    it('builds 2h slots from wake to bed (exclusive)', () => {
        expect(buildReminderSlots('07:00', '22:00', 2)).toEqual([
            7 * 60,
            9 * 60,
            11 * 60,
            13 * 60,
            15 * 60,
            17 * 60,
            19 * 60,
            21 * 60,
        ]);
    });

    it('supports overnight wake→bed windows', () => {
        expect(buildReminderSlots('22:00', '06:00', 2)).toEqual([22 * 60, 0, 2 * 60, 4 * 60]);
    });
});

describe('resolveNextReminderMinutes', () => {
    it('returns the next upcoming schedule slot when there is no intake today', () => {
        const nowMs = localMs(10, 15);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs: null,
            }),
        ).toBe(11 * 60);
    });

    it('delays past schedule slots until interval after last drink', () => {
        const nowMs = localMs(14, 0);
        const lastIntakeMs = localMs(13, 30);
        // Slots … 13:00, 15:00 … — after 13:30 + 2h = 15:30 → next slot 17:00
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs,
            }),
        ).toBe(17 * 60);
    });

    it('ignores yesterday intake when choosing the next slot', () => {
        const nowMs = localMs(10, 0);
        const lastIntakeMs = localMs(22, 0, -1);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs,
            }),
        ).toBe(11 * 60);
    });

    it('keeps the last slot when the user has not logged yet but is still awake', () => {
        const nowMs = localMs(21, 30);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs: null,
            }),
        ).toBe(21 * 60);
    });

    it('returns null after bedtime when there was no intake', () => {
        const nowMs = localMs(22, 30);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs: null,
            }),
        ).toBeNull();
    });

    it('returns null after the last slot when the user already logged today', () => {
        const nowMs = localMs(21, 30);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs: localMs(20, 0),
            }),
        ).toBeNull();
    });

    it('returns a morning slot for overnight schedules after evening slots pass', () => {
        const nowMs = localMs(23, 30);
        expect(
            resolveNextReminderMinutes({
                wakeTime: '22:00',
                bedTime: '06:00',
                nowMs,
                lastIntakeMs: null,
            }),
        ).toBe(0);
    });

    it('uses first slot after activity delay when still inside the window', () => {
        const nowMs = localMs(8, 0);
        const lastIntakeMs = localMs(7, 10);
        // 07:10 + 2h = 09:10 → next slot 09:00 is too early → 11:00
        expect(
            resolveNextReminderMinutes({
                wakeTime: '07:00',
                bedTime: '22:00',
                nowMs,
                lastIntakeMs,
            }),
        ).toBe(11 * 60);
    });
});

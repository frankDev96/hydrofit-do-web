import { describe, expect, it } from 'vitest';
import {
    deriveHydrationSchedule,
    derivePortionPlan,
    deriveReminderPortionPlan,
    formatMinutesTo12Hour,
} from './portionPlan';

function localMs(hours: number, minutes: number): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0).getTime();
}

describe('derivePortionPlan', () => {
    it('splits a default wake window into 11 sips', () => {
        expect(derivePortionPlan(2210, '07:00', '22:00')).toEqual({
            frequencyCount: 11,
            portionSizeMl: 201,
        });
    });

    it('wraps overnight schedules across midnight', () => {
        const plan = derivePortionPlan(2000, '22:00', '06:00');
        expect(plan.frequencyCount).toBeGreaterThan(0);
        expect(plan.portionSizeMl * plan.frequencyCount).toBeGreaterThan(0);
    });

    it('never returns a zero frequency', () => {
        expect(derivePortionPlan(500, '08:00', '08:30').frequencyCount).toBeGreaterThanOrEqual(1);
    });
});

describe('deriveReminderPortionPlan', () => {
    it('matches 2h reminder slot count for a default day', () => {
        expect(deriveReminderPortionPlan(2400, '07:00', '22:00', 2)).toEqual({
            frequencyCount: 8,
            portionSizeMl: 300,
        });
    });
});

describe('formatMinutesTo12Hour', () => {
    it('formats morning, afternoon, and midnight correctly', () => {
        expect(formatMinutesTo12Hour(450)).toBe('07:30 AM');
        expect(formatMinutesTo12Hour(750)).toBe('12:30 PM');
        expect(formatMinutesTo12Hour(0)).toBe('12:00 AM');
        expect(formatMinutesTo12Hour(1140)).toBe('07:00 PM');
    });
});

describe('deriveHydrationSchedule', () => {
    it('builds reminder slots and marks the evening next cue active', () => {
        const slots = deriveHydrationSchedule(2400, '07:00', '22:00', {
            nowMs: localMs(18, 30),
            lastIntakeMs: null,
        });

        expect(slots).toHaveLength(8);
        expect(slots[0].time).toBe('07:00 AM');
        expect(slots[0].volume).toBe('300 ml');
        expect(slots[0].isActive).toBe(false);

        const evening = slots.find(slot => slot.time === '07:00 PM');
        expect(evening?.title).toBe('Evening Intake');
        expect(evening?.isActive).toBe(true);
    });

    it('delays the active slot after the first evening drink', () => {
        const slots = deriveHydrationSchedule(2400, '07:00', '22:00', {
            nowMs: localMs(19, 15),
            lastIntakeMs: localMs(19, 0),
        });

        const active = slots.find(slot => slot.isActive);
        expect(active?.time).toBe('09:00 PM');
    });

    it('keeps the last slot active for a late first open before bed', () => {
        const slots = deriveHydrationSchedule(2400, '07:00', '22:00', {
            nowMs: localMs(21, 30),
            lastIntakeMs: null,
        });

        const active = slots.find(slot => slot.isActive);
        expect(active?.time).toBe('09:00 PM');
    });
});

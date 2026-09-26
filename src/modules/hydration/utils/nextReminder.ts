import { isTodayLocal, parseTimeToMinutes } from '@common/utils';

/** Matches `NotificationService.scheduleHydrationReminders` default interval. */
export const DEFAULT_REMINDER_INTERVAL_HOURS = 2;

/**
 * Build reminder slot minutes-from-midnight in the wake→bed window.
 * Same stepping rules as NotificationService (same-day window: wake inclusive, bed exclusive).
 */
export function buildReminderSlots(
    wakeTime: string,
    bedTime: string,
    intervalHours: number = DEFAULT_REMINDER_INTERVAL_HOURS,
): number[] {
    const wakeMinutes = parseTimeToMinutes(wakeTime);
    const bedMinutes = parseTimeToMinutes(bedTime);
    const intervalMinutes = Math.max(1, Math.round(intervalHours * 60));
    const slots: number[] = [];

    if (bedMinutes > wakeMinutes) {
        for (let m = wakeMinutes; m < bedMinutes; m += intervalMinutes) {
            slots.push(m);
        }
        return slots;
    }

    // Overnight window (e.g. 22:00 → 06:00): wake→midnight, then midnight→bed.
    for (let m = wakeMinutes; m < 24 * 60; m += intervalMinutes) {
        slots.push(m);
    }
    for (let m = 0; m < bedMinutes; m += intervalMinutes) {
        slots.push(m);
    }
    return slots;
}

export type ResolveNextReminderInput = {
    wakeTime: string;
    bedTime: string;
    /** Most recent intake timestamp (ms). Only today's intakes affect the next slot. */
    lastIntakeMs?: number | null;
    intervalHours?: number;
    nowMs?: number;
};

/**
 * Next reminder as minutes-from-midnight, or `null` when none remain before bed.
 *
 * Uses the fixed wake/bed schedule, but delays past the next slot until at least
 * `intervalHours` after the user's last drink today (activity-aware).
 */
export function resolveNextReminderMinutes({
    wakeTime,
    bedTime,
    lastIntakeMs = null,
    intervalHours = DEFAULT_REMINDER_INTERVAL_HOURS,
    nowMs = Date.now(),
}: ResolveNextReminderInput): number | null {
    const wakeMinutes = parseTimeToMinutes(wakeTime);
    const bedMinutes = parseTimeToMinutes(bedTime);
    const overnight = bedMinutes <= wakeMinutes;
    const slots = buildReminderSlots(wakeTime, bedTime, intervalHours);
    if (slots.length === 0) {
        return null;
    }

    const now = new Date(nowMs);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const intervalMinutes = Math.max(1, Math.round(intervalHours * 60));

    let threshold = nowMinutes;
    if (lastIntakeMs != null && Number.isFinite(lastIntakeMs) && isTodayLocal(lastIntakeMs, nowMs)) {
        const last = new Date(lastIntakeMs);
        const lastMinutes = last.getHours() * 60 + last.getMinutes();
        threshold = Math.max(threshold, lastMinutes + intervalMinutes);
    }

    const hasLoggedToday = lastIntakeMs != null && Number.isFinite(lastIntakeMs) && isTodayLocal(lastIntakeMs, nowMs);

    const upcomingSameClock = slots.find(slot => slot >= threshold);
    if (upcomingSameClock != null) {
        return upcomingSameClock;
    }

    // Evening slots exhausted in an overnight window → next is the first morning slot.
    if (overnight && threshold >= wakeMinutes) {
        return slots.find(slot => slot < bedMinutes) ?? null;
    }

    // First open / no drinks yet, still awake after the last tick (common evening start):
    // keep the last slot as the active cue instead of "done for today".
    if (!hasLoggedToday && !overnight && nowMinutes < bedMinutes) {
        const lastSlot = slots[slots.length - 1];
        if (lastSlot != null && lastSlot < nowMinutes) {
            return lastSlot;
        }
    }

    return null;
}

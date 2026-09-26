import { formatMinutesTo12Hour, parseTimeToMinutes } from '@common/utils';
import { t } from '@i18n';
import type { TranslationKey } from '@i18n';
import { DEFAULT_REMINDER_INTERVAL_HOURS, buildReminderSlots, resolveNextReminderMinutes } from './nextReminder';

export { formatMinutesTo12Hour, parseTimeToMinutes };

/** Typical sip interval used to split the daily target across the waking window. */
const PORTION_INTERVAL_MINUTES = 80;

export type PortionPlan = {
    frequencyCount: number;
    portionSizeMl: number;
};

export type ScheduleSlot = {
    id: string;
    title: string;
    volume: string;
    time: string;
    isActive?: boolean;
};

export type DeriveHydrationScheduleOptions = {
    nowMs?: number;
    lastIntakeMs?: number | null;
    intervalHours?: number;
};

/**
 * Split dailyTargetMl across the wake→bed window in ~80-minute sips.
 * 07:00–22:00 → 11 times (matches the Figma ×11 / ~201ml example).
 */
export function derivePortionPlan(dailyTargetMl: number, wakeTime: string, bedTime: string): PortionPlan {
    const wakeMinutes = parseTimeToMinutes(wakeTime);
    const bedMinutes = parseTimeToMinutes(bedTime);
    let awakeMinutes = bedMinutes - wakeMinutes;
    if (awakeMinutes <= 0) {
        awakeMinutes += 24 * 60;
    }

    const frequencyCount = Math.max(1, Math.round(awakeMinutes / PORTION_INTERVAL_MINUTES));
    const portionSizeMl = Math.max(1, Math.round(dailyTargetMl / frequencyCount));

    return { frequencyCount, portionSizeMl };
}

/**
 * Portion plan aligned to reminder notification slots (wake→bed @ interval hours).
 */
export function deriveReminderPortionPlan(
    dailyTargetMl: number,
    wakeTime: string,
    bedTime: string,
    intervalHours: number = DEFAULT_REMINDER_INTERVAL_HOURS,
): PortionPlan {
    const slots = buildReminderSlots(wakeTime, bedTime, intervalHours);
    const frequencyCount = Math.max(1, slots.length);
    const portionSizeMl = Math.max(1, Math.round(dailyTargetMl / frequencyCount));
    return { frequencyCount, portionSizeMl };
}

function scheduleTitleForMinutes(totalMinutes: number): string {
    const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hour = Math.floor(normalized / 60);
    let titleKey: TranslationKey;
    if (hour >= 5 && hour < 9) {
        titleKey = 'plan.morningSpark';
    } else if (hour >= 9 && hour < 12) {
        titleKey = 'plan.preWorkHydration';
    } else if (hour >= 12 && hour < 15) {
        titleKey = 'plan.lunchGlass';
    } else if (hour >= 15 && hour < 18) {
        titleKey = 'plan.afternoonBoost';
    } else {
        titleKey = 'plan.eveningIntake';
    }
    return t(titleKey);
}

/**
 * Hydration schedule from the same wake→bed reminder slots used on Home / notifications.
 * Highlights the activity-aware next reminder slot.
 */
export function deriveHydrationSchedule(
    dailyTargetMl: number,
    wakeTime: string,
    bedTime: string,
    options: DeriveHydrationScheduleOptions = {},
): ScheduleSlot[] {
    const target = dailyTargetMl || 2400;
    const wake = wakeTime || '07:00';
    const bed = bedTime || '22:00';
    const intervalHours = options.intervalHours ?? DEFAULT_REMINDER_INTERVAL_HOURS;
    const nowMs = options.nowMs ?? Date.now();
    const lastIntakeMs = options.lastIntakeMs ?? null;

    const slotMinutes = buildReminderSlots(wake, bed, intervalHours);
    const slotVolume = Math.max(1, Math.round(target / Math.max(1, slotMinutes.length)));
    const activeMinutes = resolveNextReminderMinutes({
        wakeTime: wake,
        bedTime: bed,
        lastIntakeMs,
        intervalHours,
        nowMs,
    });

    return slotMinutes.map((minutes, index) => ({
        id: String(index + 1),
        title: scheduleTitleForMinutes(minutes),
        volume: t('common.unitMl', { amount: slotVolume }),
        time: formatMinutesTo12Hour(minutes),
        isActive: activeMinutes != null && minutes === activeMinutes,
    }));
}

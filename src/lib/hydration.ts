export const QUICK_PRESETS = [150, 250, 500, 750] as const;
export const PORTION_INTERVAL_MINUTES = 80;
export const REMINDER_INTERVAL_HOURS = 2;
export const ML_PER_LEVEL = 750;
export const HABIT_STARTER_DAYS = 3;
export const EARLY_BIRD_HOUR = 8;
export const CENTURION_LOG_COUNT = 100;

export const CONTAINERS = [
    { id: 'small-cup', name: 'Small cup', amountMl: 150 },
    { id: 'standard-glass', name: 'Standard glass', amountMl: 250 },
    { id: 'large-mug', name: 'Large mug', amountMl: 500 },
    { id: 'sports-bottle', name: 'Sports bottle', amountMl: 750 },
] as const;

export type Gender = 'male' | 'female' | 'other';
export type WeightUnit = 'kg' | 'lbs';
export type VolumeUnit = 'ml' | 'flOz';
export type ThemeMode = 'light' | 'dark';
export type ReminderMode = 'sound' | 'display' | 'off';

export type IntakeLog = {
    id: string;
    amountMl: number;
    loggedAtMs: number;
};

export type CustomContainer = {
    id: string;
    amountMl: number;
};

export type InboxItem = {
    id: string;
    title: string;
    body: string;
    atMs: number;
};

export type AchievementId = 'first-drop' | 'target-smasher' | 'habit-starter' | 'early-bird' | 'centurion';

export const ACHIEVEMENTS: Record<AchievementId, { title: string; description: string }> = {
    'first-drop': {
        title: 'First Drop',
        description: 'Logged your first glass of water.',
    },
    'target-smasher': {
        title: 'Target Smasher',
        description: 'Hit your daily hydration target.',
    },
    'habit-starter': {
        title: 'Habit Starter',
        description: 'Logged water 3 days in a row.',
    },
    'early-bird': {
        title: 'Early Bird',
        description: 'Logged water before 8 AM.',
    },
    centurion: {
        title: 'Centurion',
        description: 'Logged 100 glasses of water.',
    },
};

export type IntakeByDate = Record<string, IntakeLog[]>;

export function dateKey(ms = Date.now()): string {
    const date = new Date(ms);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

export function dailyTargetMl(weightKg: number): number {
    return Math.round((weightKg * 33) / 10) * 10;
}

export function parseTimeToMinutes(time: string): number {
    const [hourText, minuteText] = time.split(':');
    const hour = Number(hourText);
    const minute = Number(minuteText);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
        return 0;
    }
    return hour * 60 + minute;
}

export function isBedAfterWake(wakeTime: string, bedTime: string): boolean {
    return parseTimeToMinutes(bedTime) > parseTimeToMinutes(wakeTime);
}

export function formatMinutesTo12Hour(totalMinutes: number): string {
    const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hour24 = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function formatTimeLabel(time: string): string {
    return formatMinutesTo12Hour(parseTimeToMinutes(time));
}

export function kgToLbs(kg: number): number {
    return kg * 2.2046226218;
}

export function lbsToKg(lbs: number): number {
    return lbs / 2.2046226218;
}

export function formatWeight(weightKg: number, unit: WeightUnit): string {
    if (unit === 'lbs') {
        return `${Math.round(kgToLbs(weightKg))} lbs`;
    }
    return `${Math.round(weightKg)} kg`;
}

export function formatVolume(amountMl: number, unit: VolumeUnit): string {
    if (unit === 'flOz') {
        const ounces = amountMl / 29.5735295625;
        return `${ounces >= 10 ? Math.round(ounces) : ounces.toFixed(1)} fl oz`;
    }
    return `${Math.round(amountMl)} ml`;
}

export function derivePortionPlan(
    targetMl: number,
    wakeTime: string,
    bedTime: string,
): { frequencyCount: number; portionSizeMl: number } {
    const wake = parseTimeToMinutes(wakeTime);
    const bed = parseTimeToMinutes(bedTime);
    let awake = bed - wake;
    if (awake <= 0) {
        awake += 24 * 60;
    }
    const frequencyCount = Math.max(1, Math.round(awake / PORTION_INTERVAL_MINUTES));
    const portionSizeMl = Math.max(1, Math.round(targetMl / frequencyCount));
    return { frequencyCount, portionSizeMl };
}

export function buildReminderSlots(
    wakeTime: string,
    bedTime: string,
    intervalHours = REMINDER_INTERVAL_HOURS,
): number[] {
    const wakeMinutes = parseTimeToMinutes(wakeTime);
    const bedMinutes = parseTimeToMinutes(bedTime);
    const intervalMinutes = Math.max(1, Math.round(intervalHours * 60));
    const slots: number[] = [];

    if (bedMinutes > wakeMinutes) {
        for (let minute = wakeMinutes; minute < bedMinutes; minute += intervalMinutes) {
            slots.push(minute);
        }
        return slots;
    }

    for (let minute = wakeMinutes; minute < 24 * 60; minute += intervalMinutes) {
        slots.push(minute);
    }
    for (let minute = 0; minute < bedMinutes; minute += intervalMinutes) {
        slots.push(minute);
    }
    return slots;
}

export function resolveNextReminderMinutes(input: {
    wakeTime: string;
    bedTime: string;
    lastIntakeMs?: number | null;
    nowMs?: number;
}): number | null {
    const wakeMinutes = parseTimeToMinutes(input.wakeTime);
    const bedMinutes = parseTimeToMinutes(input.bedTime);
    const overnight = bedMinutes <= wakeMinutes;
    const slots = buildReminderSlots(input.wakeTime, input.bedTime);
    if (slots.length === 0) {
        return null;
    }

    const now = new Date(input.nowMs ?? Date.now());
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const intervalMinutes = REMINDER_INTERVAL_HOURS * 60;
    let threshold = nowMinutes;
    const lastIntakeMs = input.lastIntakeMs ?? null;
    const loggedToday = lastIntakeMs != null && dateKey(lastIntakeMs) === dateKey(now.getTime());
    if (loggedToday && lastIntakeMs != null) {
        const last = new Date(lastIntakeMs);
        const lastMinutes = last.getHours() * 60 + last.getMinutes();
        threshold = Math.max(threshold, lastMinutes + intervalMinutes);
    }

    const upcoming = slots.find(slot => slot >= threshold);
    if (upcoming != null) {
        return upcoming;
    }
    if (overnight && threshold >= wakeMinutes) {
        return slots.find(slot => slot < bedMinutes) ?? null;
    }
    if (!loggedToday && !overnight && nowMinutes < bedMinutes) {
        const lastSlot = slots[slots.length - 1];
        if (lastSlot != null && lastSlot < nowMinutes) {
            return lastSlot;
        }
    }
    return null;
}

function scheduleTitle(totalMinutes: number): string {
    const hour = Math.floor((((totalMinutes % 1440) + 1440) % 1440) / 60);
    if (hour >= 5 && hour < 9) return 'Morning spark';
    if (hour >= 9 && hour < 12) return 'Pre-work hydration';
    if (hour >= 12 && hour < 15) return 'Lunch glass';
    if (hour >= 15 && hour < 18) return 'Afternoon boost';
    return 'Evening intake';
}

export type ScheduleSlot = {
    id: string;
    title: string;
    volumeMl: number;
    timeLabel: string;
    minutes: number;
    isActive: boolean;
};

export function deriveSchedule(input: {
    targetMl: number;
    wakeTime: string;
    bedTime: string;
    lastIntakeMs?: number | null;
    nowMs?: number;
}): ScheduleSlot[] {
    const slots = buildReminderSlots(input.wakeTime, input.bedTime);
    const volumeMl = Math.max(1, Math.round(input.targetMl / Math.max(1, slots.length)));
    const active = resolveNextReminderMinutes(input);
    return slots.map((minutes, index) => ({
        id: String(index + 1),
        title: scheduleTitle(minutes),
        volumeMl,
        timeLabel: formatMinutesTo12Hour(minutes),
        minutes,
        isActive: active != null && minutes === active,
    }));
}

export function dayTotal(logs: IntakeLog[] | undefined): number {
    return (logs ?? []).reduce((total, log) => total + Math.max(0, log.amountMl), 0);
}

export function sumAllMl(intakeByDate: IntakeByDate): number {
    return Object.values(intakeByDate).reduce((total, logs) => total + dayTotal(logs), 0);
}

function parseDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function currentStreak(intakeByDate: IntakeByDate, now = new Date()): number {
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayKey = dateKey(cursor.getTime());
    if (dayTotal(intakeByDate[todayKey]) <= 0) {
        cursor.setDate(cursor.getDate() - 1);
    }
    let streak = 0;
    while (dayTotal(intakeByDate[dateKey(cursor.getTime())]) > 0) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

export function maxConsecutiveDays(intakeByDate: IntakeByDate): number {
    const days = Object.entries(intakeByDate)
        .filter(([, logs]) => dayTotal(logs) > 0)
        .map(([key]) => parseDateKey(key))
        .filter((date): date is Date => date !== null)
        .sort((left, right) => left.getTime() - right.getTime());
    if (days.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let index = 1; index < days.length; index += 1) {
        const previous = days[index - 1];
        const next = days[index];
        const expected = new Date(previous.getFullYear(), previous.getMonth(), previous.getDate() + 1);
        if (expected.getTime() === next.getTime()) {
            current += 1;
            longest = Math.max(longest, current);
        } else if (previous.getTime() !== next.getTime()) {
            current = 1;
        }
    }
    return longest;
}

export function unlockedAchievements(intakeByDate: IntakeByDate, targetMl: number): AchievementId[] {
    const logs = Object.values(intakeByDate).flat();
    const ids: AchievementId[] = [];
    if (logs.some(log => log.amountMl > 0)) ids.push('first-drop');
    const target = targetMl > 0 ? targetMl : 2400;
    if (Object.values(intakeByDate).some(day => dayTotal(day) >= target)) {
        ids.push('target-smasher');
    }
    if (maxConsecutiveDays(intakeByDate) >= HABIT_STARTER_DAYS) ids.push('habit-starter');
    if (logs.some(log => log.amountMl > 0 && new Date(log.loggedAtMs).getHours() < EARLY_BIRD_HOUR)) {
        ids.push('early-bird');
    }
    if (logs.filter(log => log.amountMl > 0).length >= CENTURION_LOG_COUNT) {
        ids.push('centurion');
    }
    return ids;
}

export function deriveLevel(totalMl: number): number {
    return Math.max(1, Math.floor(Math.max(0, totalMl) / ML_PER_LEVEL));
}

export function rangeKeys(days: number, now = new Date()): string[] {
    const keys: string[] = [];
    const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    cursor.setDate(cursor.getDate() - (days - 1));
    for (let index = 0; index < days; index += 1) {
        keys.push(dateKey(cursor.getTime()));
        cursor.setDate(cursor.getDate() + 1);
    }
    return keys;
}

export function snapCustomSize(amountMl: number): number {
    const clamped = Math.min(500, Math.max(100, amountMl));
    return 100 + Math.round((clamped - 100) / 50) * 50;
}

export function weekdayLabel(key: string): string {
    const date = parseDateKey(key);
    if (!date) return key;
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

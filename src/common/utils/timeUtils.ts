/**
 * Time utility functions for formatting and parsing 24h/12h times and minutes.
 */

/**
 * Converts a 24-hour time string "HH:mm" to 12-hour formatted string "hh:mm AM/PM".
 * Example: "07:00" -> "07:00 AM", "22:00" -> "10:00 PM".
 */
export function formatTimeWithPeriod(timeStr: string): string {
    if (!timeStr || !timeStr.includes(':')) {
        return '07:00 AM';
    }
    const [hStr, mStr] = timeStr.split(':');
    const hours = parseInt(hStr, 10);
    const minutes = parseInt(mStr, 10);
    if (isNaN(hours) || isNaN(minutes)) {
        return timeStr;
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const formattedHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
    const formattedMinute = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHour}:${formattedMinute} ${period}`;
}

/**
 * Converts a Date's local hours/minutes to a 12-hour formatted time string "hh:mm AM/PM".
 */
export function formatDateTo12Hour(date: Date): string {
    return formatMinutesTo12Hour(date.getHours() * 60 + date.getMinutes());
}

/**
 * Returns a copy of `base` with hours and minutes from `source`, seconds cleared.
 */
export function applyTimeOfDay(base: Date, source: Date): Date {
    const next = new Date(base.getTime());
    next.setHours(source.getHours(), source.getMinutes(), 0, 0);
    return next;
}

/**
 * True when `picked` is strictly earlier than `now` at local minute precision.
 * The current minute and any later minute are not past.
 */
export function isPastLocalTime(picked: Date, now: Date = new Date()): boolean {
    const pickedMs = picked.getTime();
    const nowMs = now.getTime();
    if (!Number.isFinite(pickedMs) || !Number.isFinite(nowMs)) {
        return false;
    }
    const pickedFloor = applyTimeOfDay(picked, picked);
    const nowFloor = applyTimeOfDay(now, now);
    return pickedFloor.getTime() < nowFloor.getTime();
}

/**
 * Converts total minutes from midnight to a 12-hour formatted time string "hh:mm AM/PM".
 */
export function formatMinutesTo12Hour(totalMinutes: number): string {
    const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
    const hours24 = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const padH = String(hours12).padStart(2, '0');
    const padM = String(minutes).padStart(2, '0');
    return `${padH}:${padM} ${period}`;
}

/**
 * Parses a "HH:mm" time string into total minutes from midnight (0–1439).
 */
export function parseTimeToMinutes(time: string): number {
    if (!time || !time.includes(':')) {
        return 7 * 60;
    }
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
        return 7 * 60;
    }
    return hours * 60 + minutes;
}

/**
 * Local calendar day as a sortable ISO key: `YYYY-MM-DD`.
 * Uses the device timezone — not UTC `toISOString()`.
 */
export function toLocalDateKey(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Returns true when `timestampMs` falls on the same local calendar day as `nowMs`.
 */
export function isTodayLocal(timestampMs: number, nowMs: number = Date.now()): boolean {
    if (!Number.isFinite(timestampMs) || !Number.isFinite(nowMs)) {
        return false;
    }
    return toLocalDateKey(new Date(timestampMs)) === toLocalDateKey(new Date(nowMs));
}

/**
 * Returns 'AM' or 'PM' period from a "HH:mm" time string.
 */
export function getTimePeriod(timeStr: string): 'AM' | 'PM' {
    if (!timeStr || !timeStr.includes(':')) {
        return 'AM';
    }
    const [hStr] = timeStr.split(':');
    const hours = parseInt(hStr, 10);
    if (isNaN(hours)) {
        return 'AM';
    }
    return hours >= 12 ? 'PM' : 'AM';
}

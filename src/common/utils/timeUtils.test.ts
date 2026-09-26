import { describe, expect, it } from 'vitest';
import {
    applyTimeOfDay,
    formatDateTo12Hour,
    formatMinutesTo12Hour,
    formatTimeWithPeriod,
    getTimePeriod,
    isPastLocalTime,
    isTodayLocal,
    parseTimeToMinutes,
    toLocalDateKey,
} from './timeUtils';

describe('timeUtils', () => {
    describe('formatTimeWithPeriod', () => {
        it('formats valid 24h times to 12h AM/PM strings', () => {
            expect(formatTimeWithPeriod('07:00')).toBe('07:00 AM');
            expect(formatTimeWithPeriod('00:00')).toBe('12:00 AM');
            expect(formatTimeWithPeriod('12:00')).toBe('12:00 PM');
            expect(formatTimeWithPeriod('13:30')).toBe('01:30 PM');
            expect(formatTimeWithPeriod('22:00')).toBe('10:00 PM');
            expect(formatTimeWithPeriod('23:59')).toBe('11:59 PM');
        });

        it('handles malformed or empty time strings gracefully', () => {
            expect(formatTimeWithPeriod('')).toBe('07:00 AM');
            expect(formatTimeWithPeriod('bad_string')).toBe('07:00 AM');
            expect(formatTimeWithPeriod('invalid:input')).toBe('invalid:input');
        });
    });

    describe('formatDateTo12Hour', () => {
        it('formats a Date to a 12h AM/PM string', () => {
            expect(formatDateTo12Hour(new Date(2026, 8, 11, 7, 0))).toBe('07:00 AM');
            expect(formatDateTo12Hour(new Date(2026, 8, 11, 14, 30))).toBe('02:30 PM');
        });
    });

    describe('applyTimeOfDay', () => {
        it('copies hours and minutes onto the base calendar day', () => {
            const base = new Date(2026, 8, 11, 9, 15, 44, 12);
            const source = new Date(2020, 0, 1, 14, 30, 59);
            const next = applyTimeOfDay(base, source);
            expect(next.getFullYear()).toBe(2026);
            expect(next.getMonth()).toBe(8);
            expect(next.getDate()).toBe(11);
            expect(next.getHours()).toBe(14);
            expect(next.getMinutes()).toBe(30);
            expect(next.getSeconds()).toBe(0);
        });
    });

    describe('isPastLocalTime', () => {
        const now = new Date(2026, 8, 11, 10, 15, 40);

        it('accepts an earlier minute on the same day', () => {
            expect(isPastLocalTime(new Date(2026, 8, 11, 9, 0), now)).toBe(true);
            expect(isPastLocalTime(new Date(2026, 8, 11, 10, 14), now)).toBe(true);
        });

        it('rejects the current minute and any later time', () => {
            expect(isPastLocalTime(new Date(2026, 8, 11, 10, 15), now)).toBe(false);
            expect(isPastLocalTime(new Date(2026, 8, 11, 14, 30), now)).toBe(false);
        });
    });

    describe('formatMinutesTo12Hour', () => {
        it('formats minutes from midnight to 12h string', () => {
            expect(formatMinutesTo12Hour(0)).toBe('12:00 AM');
            expect(formatMinutesTo12Hour(7 * 60)).toBe('07:00 AM');
            expect(formatMinutesTo12Hour(12 * 60)).toBe('12:00 PM');
            expect(formatMinutesTo12Hour(13 * 60 + 30)).toBe('01:30 PM');
            expect(formatMinutesTo12Hour(22 * 60)).toBe('10:00 PM');
        });

        it('normalizes negative or > 24h minutes', () => {
            expect(formatMinutesTo12Hour(-60)).toBe('11:00 PM');
            expect(formatMinutesTo12Hour(1500)).toBe('01:00 AM');
        });
    });

    describe('parseTimeToMinutes', () => {
        it('parses valid HH:mm into minutes from midnight', () => {
            expect(parseTimeToMinutes('00:00')).toBe(0);
            expect(parseTimeToMinutes('07:30')).toBe(450);
            expect(parseTimeToMinutes('22:00')).toBe(1320);
        });

        it('returns default 7:00 AM (420 minutes) for invalid inputs', () => {
            expect(parseTimeToMinutes('')).toBe(420);
            expect(parseTimeToMinutes('invalid')).toBe(420);
            expect(parseTimeToMinutes('ab:cd')).toBe(420);
        });
    });

    describe('toLocalDateKey', () => {
        it('formats a local calendar day as YYYY-MM-DD', () => {
            expect(toLocalDateKey(new Date(2026, 8, 4, 0, 30))).toBe('2026-09-04');
            expect(toLocalDateKey(new Date(2026, 8, 4, 23, 59))).toBe('2026-09-04');
            expect(toLocalDateKey(new Date(2026, 0, 1, 8, 0))).toBe('2026-01-01');
        });
    });

    describe('isTodayLocal', () => {
        it('accepts timestamps on the same local calendar day', () => {
            const now = new Date(2026, 8, 4, 9, 19).getTime();
            const morning = new Date(2026, 8, 4, 0, 1).getTime();
            const night = new Date(2026, 8, 4, 23, 59).getTime();
            expect(isTodayLocal(morning, now)).toBe(true);
            expect(isTodayLocal(night, now)).toBe(true);
        });

        it('rejects timestamps from other local days', () => {
            const now = new Date(2026, 8, 4, 9, 19).getTime();
            const yesterday = new Date(2026, 8, 3, 23, 59).getTime();
            const tomorrow = new Date(2026, 8, 5, 0, 1).getTime();
            expect(isTodayLocal(yesterday, now)).toBe(false);
            expect(isTodayLocal(tomorrow, now)).toBe(false);
        });

        it('rejects non-finite timestamps', () => {
            expect(isTodayLocal(Number.NaN)).toBe(false);
            expect(isTodayLocal(Infinity)).toBe(false);
        });
    });

    describe('getTimePeriod', () => {
        it('identifies AM/PM periods correctly', () => {
            expect(getTimePeriod('06:00')).toBe('AM');
            expect(getTimePeriod('11:59')).toBe('AM');
            expect(getTimePeriod('12:00')).toBe('PM');
            expect(getTimePeriod('23:00')).toBe('PM');
            expect(getTimePeriod('')).toBe('AM');
            expect(getTimePeriod('abc')).toBe('AM');
        });
    });
});

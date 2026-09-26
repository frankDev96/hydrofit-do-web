import { describe, expect, it } from 'vitest';
import { formatDailyGoalLiters, formatNumericLabel, formatWeightLabel } from './formatUtils';

describe('formatUtils', () => {
    describe('formatNumericLabel', () => {
        it('formats integers without decimal places', () => {
            expect(formatNumericLabel(50)).toBe('50');
            expect(formatNumericLabel(0)).toBe('0');
            expect(formatNumericLabel(100)).toBe('100');
        });

        it('formats floats with 1 decimal place', () => {
            expect(formatNumericLabel(50.5)).toBe('50.5');
            expect(formatNumericLabel(50.25)).toBe('50.3');
        });
    });

    describe('formatWeightLabel', () => {
        it('formats weight in kg', () => {
            expect(formatWeightLabel(70, 'kg')).toBe('70 kg');
            expect(formatWeightLabel(65.4, 'kg')).toBe('65 kg');
        });

        it('converts and formats weight in lbs', () => {
            expect(formatWeightLabel(70, 'lbs')).toBe('154 lbs');
            expect(formatWeightLabel(100, 'lbs')).toBe('220 lbs');
        });
    });

    describe('formatDailyGoalLiters', () => {
        it('formats ml to liters with one decimal place', () => {
            expect(formatDailyGoalLiters(2310)).toBe('2.3L');
            expect(formatDailyGoalLiters(2000)).toBe('2.0L');
            expect(formatDailyGoalLiters(500)).toBe('0.5L');
        });
    });
});

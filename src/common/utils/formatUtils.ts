/**
 * Formatting utilities for numbers, weight labels, and liquid volume.
 */

const KG_PER_LB = 0.453592;

/**
 * Formats a numeric value for labels, returning integer strings without decimal places
 * or 1-decimal floating numbers (e.g., 50 -> "50", 50.5 -> "50.5").
 */
export function formatNumericLabel(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Formats a weight in kilograms to a display string based on the chosen unit ('kg' | 'lbs').
 */
export function formatWeightLabel(weightKg: number, unit: 'kg' | 'lbs' | string): string {
    if (unit === 'lbs') {
        return `${Math.round(weightKg / KG_PER_LB)} lbs`;
    }
    return `${Math.round(weightKg)} kg`;
}

/**
 * Formats daily target millilitres into litres with one decimal place.
 * Example: 2310 -> "2.3L"
 */
export function formatDailyGoalLiters(dailyTargetMl: number): string {
    const liters = dailyTargetMl / 1000;
    return `${liters.toFixed(1)}L`;
}

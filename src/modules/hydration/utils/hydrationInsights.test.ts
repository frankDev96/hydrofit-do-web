import { describe, expect, it } from 'vitest';
import {
    deriveEnergyBoost,
    deriveEnvironmentalBoosts,
    deriveHydrationIntensity,
    deriveRecoveryTrack,
    formatDailyGoalLiters,
} from './hydrationInsights';

describe('hydrationInsights', () => {
    it('formats daily target ml as liters per day', () => {
        expect(formatDailyGoalLiters(2310)).toBe('2.3 / day');
        expect(formatDailyGoalLiters(2800)).toBe('2.8 / day');
    });

    it('derives intensity tiers from daily target', () => {
        expect(deriveHydrationIntensity(1650)).toBe('LOW');
        expect(deriveHydrationIntensity(2310)).toBe('MODERATE');
        expect(deriveHydrationIntensity(2970)).toBe('HIGH');
    });

    it('derives energy boost from daily target tier', () => {
        expect(deriveEnergyBoost(1650)).toBe('+8% Focus');
        expect(deriveEnergyBoost(2310)).toBe('+15% Focus');
        expect(deriveEnergyBoost(2970)).toBe('+25% Focus');
    });

    it('derives recovery track from daily target tier', () => {
        expect(deriveRecoveryTrack(1650)).toBe('Steady Pace');
        expect(deriveRecoveryTrack(2310)).toBe('Fast Track');
        expect(deriveRecoveryTrack(2970)).toBe('Peak Restore');
    });

    it('scales environmental boosts from the calculated daily target', () => {
        const moderate = deriveEnvironmentalBoosts(2400, 11);
        expect(moderate).toEqual([
            {
                id: 'climate',
                title: 'Warm Weather',
                amountMl: 300,
                subtitle: '+300 ml • Higher perspiration during daytime',
            },
            {
                id: 'activity',
                title: 'High Activity Level',
                amountMl: 450,
                subtitle: '+450 ml • Calibrated for workout days • 11x',
            },
        ]);

        const low = deriveEnvironmentalBoosts(1650, 8);
        expect(low[0]?.title).toBe('Mild Climate');
        expect(low[0]?.amountMl).toBe(210);
        expect(low[1]?.title).toBe('Light Activity');
        expect(low[1]?.subtitle).toContain('8 daily intakes');

        const high = deriveEnvironmentalBoosts(2970, 12);
        expect(high[0]?.title).toBe('Hot Climate');
        expect(high[1]?.title).toBe('Peak Training');
        expect(high[1]?.amountMl).toBe(560);
    });
});

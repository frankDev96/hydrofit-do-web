import { describe, expect, it } from 'vitest';
import { describeHydrationPace, didCrossHalfway, expectedIntakeByNowMl } from './hydrationPace';

function localMs(hours: number, minutes: number): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0).getTime();
}

describe('didCrossHalfway', () => {
    it('fires once when intake crosses 50%', () => {
        expect(didCrossHalfway(900, 1200, 2000)).toBe(true);
        expect(didCrossHalfway(1200, 1500, 2000)).toBe(false);
        expect(didCrossHalfway(0, 900, 2000)).toBe(false);
        expect(didCrossHalfway(0, 1000, 0)).toBe(false);
    });
});

describe('expectedIntakeByNowMl', () => {
    it('is zero at wake and full at bed', () => {
        expect(expectedIntakeByNowMl(2400, '07:00', '19:00', localMs(7, 0))).toBe(0);
        expect(expectedIntakeByNowMl(2400, '07:00', '19:00', localMs(19, 0))).toBe(2400);
        expect(expectedIntakeByNowMl(2400, '07:00', '19:00', localMs(13, 0))).toBe(1200);
    });
});

describe('describeHydrationPace', () => {
    it('reports ahead when intake beats the linear schedule', () => {
        const pace = describeHydrationPace({
            todayIntakeMl: 1400,
            dailyTargetMl: 2400,
            wakeTime: '07:00',
            bedTime: '19:00',
            nowMs: localMs(13, 0),
        });
        expect(pace.kind).toBe('ahead');
        expect(pace.percent).toBe(58);
        expect(pace.deltaMl).toBe(200);
        expect(pace.chip).toBe('Ahead of pace');
        expect(pace.body).toContain('200');
    });

    it('reports behind when intake lags the linear schedule', () => {
        const pace = describeHydrationPace({
            todayIntakeMl: 200,
            dailyTargetMl: 2400,
            wakeTime: '07:00',
            bedTime: '19:00',
            nowMs: localMs(13, 0),
        });
        expect(pace.kind).toBe('behind');
        expect(pace.chip).toBe('Behind pace');
    });
});

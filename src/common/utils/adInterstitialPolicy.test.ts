import { describe, expect, it } from 'vitest';
import { shouldOfferInterstitial } from './adInterstitialPolicy';

describe('shouldOfferInterstitial', () => {
    it('never offers on launch or before the first log', () => {
        expect(shouldOfferInterstitial(0, false)).toBe(false);
        expect(shouldOfferInterstitial(0, true)).toBe(false);
    });

    it('skips logs that are not every third and did not hit the daily goal', () => {
        expect(shouldOfferInterstitial(1, false)).toBe(false);
        expect(shouldOfferInterstitial(2, false)).toBe(false);
        expect(shouldOfferInterstitial(4, false)).toBe(false);
    });

    it('offers on every third log of the day', () => {
        expect(shouldOfferInterstitial(3, false)).toBe(true);
        expect(shouldOfferInterstitial(6, false)).toBe(true);
    });

    it('offers the first time a log crosses the daily goal', () => {
        expect(shouldOfferInterstitial(1, true)).toBe(true);
        expect(shouldOfferInterstitial(2, true)).toBe(true);
    });

    it('deduplicates a third log that also hits the goal into one offer', () => {
        expect(shouldOfferInterstitial(3, true)).toBe(true);
    });
});

import { beforeEach, describe, expect, it } from 'vitest';
import AdService from './AdService';

describe('AdService', () => {
    beforeEach(() => {
        AdService.resetForTests();
    });

    it('does not request ads in the browser companion', async () => {
        await AdService.initialize();
        expect(AdService.canRequestAds()).toBe(false);
        await expect(AdService.showPrivacyOptionsForm()).resolves.toBe(false);
        expect(() => AdService.maybeShowInterstitial({ logCountToday: 3, didJustHitDailyGoal: true })).not.toThrow();
    });
});

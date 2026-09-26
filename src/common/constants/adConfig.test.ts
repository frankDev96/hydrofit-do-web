import { describe, expect, it } from 'vitest';
import { AdConfig, resolveBannerUnitId, resolveInterstitialUnitId } from './adConfig';

describe('adConfig', () => {
    it('keeps unit IDs empty until a web ad unit is configured', () => {
        expect(AdConfig.bannerUnitId).toBe('');
        expect(AdConfig.interstitialUnitId).toBe('');
        expect(resolveBannerUnitId()).toBeNull();
        expect(resolveInterstitialUnitId()).toBeNull();
    });
});

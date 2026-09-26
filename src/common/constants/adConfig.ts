/**
 * Ad unit IDs.
 * This companion does not request ads. Live unit IDs stay empty until a web ad unit is configured.
 */
export const AdConfig = {
    /** Live banner unit. Empty disables banners. */
    bannerUnitId: '',
    /** Live interstitial unit. Empty disables interstitials. */
    interstitialUnitId: '',
} as const;

export type AdConfigType = typeof AdConfig;

export function resolveBannerUnitId(): string | null {
    return AdConfig.bannerUnitId || null;
}

export function resolveInterstitialUnitId(): string | null {
    return AdConfig.interstitialUnitId || null;
}

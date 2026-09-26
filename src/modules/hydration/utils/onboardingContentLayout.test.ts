import { describe, expect, it } from 'vitest';
import { OnboardingLayout } from '@theme';
import { resolveOnboardingContentMetrics } from './onboardingContentLayout';

describe('resolveOnboardingContentMetrics', () => {
    it('caps heading width so copy does not span the full screen', () => {
        const metrics = resolveOnboardingContentMetrics(400, 640);

        expect(metrics.headingMaxWidth).toBe(OnboardingLayout.headingMaxWidth);
        expect(metrics.headingMaxWidth).toBeLessThan(400);
    });

    it('shrinks weight and time drums when pager height is short', () => {
        const tall = resolveOnboardingContentMetrics(360, 700);
        const short = resolveOnboardingContentMetrics(360, 420);

        expect(short.weightCardHeight).toBeLessThan(tall.weightCardHeight);
        expect(short.timeDrumHeight).toBeLessThanOrEqual(tall.timeDrumHeight);
        expect(short.illustrationHeight).toBeLessThan(tall.illustrationHeight);
        expect(short.weightCardHeight).toBeGreaterThanOrEqual(OnboardingLayout.weightCardMinHeight);
        expect(short.weightVisibleItemCount % 2).toBe(1);
    });

    it('uses compact time item height when the drum budget is below the max', () => {
        const compact = resolveOnboardingContentMetrics(320, 80);
        const roomy = resolveOnboardingContentMetrics(400, 1200);
        expect(compact.timeItemHeight).toBe(OnboardingLayout.timeItemHeightCompact);
        expect(roomy.timeItemHeight).toBe(OnboardingLayout.timeItemHeight);
    });
});

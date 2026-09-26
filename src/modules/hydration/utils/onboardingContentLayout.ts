import { OnboardingLayout, Spacing } from '@theme';

export type OnboardingContentMetrics = {
    headingMaxWidth: number;
    weightCardHeight: number;
    weightDrumHeight: number;
    weightItemHeight: number;
    weightVisibleItemCount: number;
    timeDrumHeight: number;
    timeItemHeight: number;
    illustrationWidth: number;
    illustrationHeight: number;
};

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

function oddVisibleCount(preferred: number, maxFit: number): number {
    const capped = Math.min(preferred, Math.max(3, maxFit));
    return capped % 2 === 0 ? capped - 1 : capped;
}

/**
 * Metrics for onboarding step bodies inside the pager.
 * Pass the pager’s laid-out height (not full window height) so content fits
 * the space left after chrome + in-flow footer.
 */
export function resolveOnboardingContentMetrics(screenWidth: number, contentHeight: number): OnboardingContentMetrics {
    const availableHeight = Math.max(contentHeight, OnboardingLayout.weightCardMinHeight);
    const headingMaxWidth = Math.min(OnboardingLayout.headingMaxWidth, Math.max(0, screenWidth - Spacing.md * 2));

    const weightCardHeight = Math.round(
        clamp(
            availableHeight - OnboardingLayout.weightNonPickerReserve,
            OnboardingLayout.weightCardMinHeight,
            OnboardingLayout.weightCardMaxHeight,
        ),
    );
    const weightDrumHeight = Math.max(OnboardingLayout.weightItemHeightCompact * 5, weightCardHeight);
    const weightVisibleItemCount = oddVisibleCount(
        9,
        Math.floor(weightDrumHeight / OnboardingLayout.weightItemHeightCompact),
    );
    const weightItemHeight = Math.max(
        OnboardingLayout.weightItemHeightCompact,
        Math.floor(weightDrumHeight / weightVisibleItemCount),
    );

    const illustrationBudget = Math.max(
        Spacing.xxxl,
        availableHeight -
            OnboardingLayout.timeNonPickerReserve -
            OnboardingLayout.timeDrumMinHeight -
            OnboardingLayout.timeCardChrome,
    );
    /** Keep a compact sun/moon; still shrink further on short pagers. */
    const illustrationHeight = Math.round(
        clamp(Math.min(screenWidth * 0.36, illustrationBudget * 0.48), Spacing.xl, screenWidth * 0.4),
    );
    const illustrationWidth = Math.round(illustrationHeight * 1.09);

    const timeDrumBudget = Math.max(
        OnboardingLayout.timeDrumMinHeight,
        availableHeight - OnboardingLayout.timeNonPickerReserve - illustrationHeight - OnboardingLayout.timeCardChrome,
    );
    const timeItemHeight =
        timeDrumBudget >= OnboardingLayout.timeDrumMaxHeight
            ? OnboardingLayout.timeItemHeight
            : OnboardingLayout.timeItemHeightCompact;
    const timeVisibleRows = oddVisibleCount(5, Math.floor(timeDrumBudget / timeItemHeight));
    const timeDrumHeight = Math.round(
        clamp(timeVisibleRows * timeItemHeight, OnboardingLayout.timeDrumMinHeight, OnboardingLayout.timeDrumMaxHeight),
    );

    return {
        headingMaxWidth,
        weightCardHeight,
        weightDrumHeight: weightItemHeight * weightVisibleItemCount,
        weightItemHeight,
        weightVisibleItemCount,
        timeDrumHeight,
        timeItemHeight,
        illustrationWidth,
        illustrationHeight,
    };
}

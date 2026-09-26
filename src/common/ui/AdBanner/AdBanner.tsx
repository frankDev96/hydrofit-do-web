import React from 'react';

export type AdBannerProps = {
    dismissible?: boolean;
    onDismiss?: () => void;
    padBottomInset?: boolean;
};

/** This companion does not render advertising. */
export function AdBanner(_props: AdBannerProps): null {
    return null;
}

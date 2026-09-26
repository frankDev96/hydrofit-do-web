import React, { useState } from 'react';
import { css, imageSrc, type ImageSource, type ImageStyle, type StyleProp } from '@/common/css';
import { MinusIcon, PlusIcon } from '@common/icons';
import { useTranslation } from '@i18n';
import { AvatarLayout, Spacing, TouchTarget, useColors } from '@theme';

export type ZoomablePreviewImageProps = {
    source: ImageSource;
    resetToken: string | number | boolean;
    accessibilityLabel: string;
    accessibilityHint?: string;
    imageStyle: StyleProp<ImageStyle>;
    onError?: () => void;
};

function clampScale(value: number): number {
    return Math.min(AvatarLayout.previewMaxScale, Math.max(AvatarLayout.previewMinScale, value));
}

/** Button zoom for the profile photo lightbox. */
export function ZoomablePreviewImage({
    source,
    resetToken,
    accessibilityLabel,
    accessibilityHint,
    imageStyle,
    onError,
}: ZoomablePreviewImageProps): React.JSX.Element {
    const { t } = useTranslation();
    const colors = useColors();
    const [scale, setScale] = useState<number>(AvatarLayout.previewMinScale);
    const src = imageSrc(source);

    return (
        <div key={String(resetToken)} style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
            {src ? (
                <img
                    src={src}
                    alt={accessibilityLabel}
                    title={accessibilityHint}
                    onError={onError}
                    style={css(imageStyle, { transform: `scale(${scale})`, objectFit: 'contain' })}
                />
            ) : null}
            <div style={{ display: 'flex', gap: Spacing.sm, marginTop: Spacing.sm }}>
                <button
                    type="button"
                    aria-label={t('profile.photoZoomOutA11y')}
                    onClick={() => setScale(current => clampScale(current - AvatarLayout.previewZoomStep))}
                    style={{ width: TouchTarget.min, height: TouchTarget.min }}
                >
                    <MinusIcon size={20} color={colors.text} />
                </button>
                <button
                    type="button"
                    aria-label={t('profile.photoZoomInA11y')}
                    onClick={() => setScale(current => clampScale(current + AvatarLayout.previewZoomStep))}
                    style={{ width: TouchTarget.min, height: TouchTarget.min }}
                >
                    <PlusIcon size={20} color={colors.text} />
                </button>
            </div>
        </div>
    );
}

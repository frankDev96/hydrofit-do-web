import React, { useState } from 'react';
import { imageSrc, type ImageSource } from '@/common/css';
import { withTapHaptic } from '@common/haptics/tapHaptic';
import { CloseIcon } from '@common/icons';
import { useTranslation } from '@i18n';
import { Spacing, TouchTarget, useColors } from '@theme';
import { UserAvatar } from '../UserAvatar/UserAvatar';
import { ZoomablePreviewImage } from './ZoomablePreviewImage';

export type FullScreenImageModalProps = {
    visible: boolean;
    source?: ImageSource;
    fallbackSource?: ImageSource;
    initials?: string;
    accessibilityLabel: string;
    onClose: () => void;
    onError?: () => void;
};

function photoSourceKey(source: ImageSource | undefined): string {
    if (typeof source === 'string' || typeof source === 'number') return String(source);
    if (source && typeof source === 'object') return source.uri ?? source.src ?? '';
    return '';
}

export function FullScreenImageModal(props: FullScreenImageModalProps): React.JSX.Element {
    return <FullScreenImageModalView key={photoSourceKey(props.source)} {...props} />;
}

function FullScreenImageModalView({
    visible,
    source,
    fallbackSource,
    initials,
    accessibilityLabel,
    onClose,
    onError,
}: FullScreenImageModalProps): React.JSX.Element | null {
    const { t } = useTranslation();
    const colors = useColors();
    const [photoFailed, setPhotoFailed] = useState(false);
    const showPhoto = Boolean(imageSrc(source)) && !photoFailed;

    if (!visible) return null;

    return (
        <div role="dialog" aria-label={accessibilityLabel} style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
            <button
                type="button"
                aria-label={t('common.closeBackdrop')}
                onClick={withTapHaptic(onClose)}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', border: 'none' }}
            />
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'grid', placeItems: 'center' }}>
                {showPhoto && source ? (
                    <ZoomablePreviewImage
                        source={source}
                        resetToken={photoSourceKey(source)}
                        accessibilityLabel={accessibilityLabel}
                        imageStyle={{ maxWidth: '100%', maxHeight: '80vh' }}
                        onError={() => {
                            setPhotoFailed(true);
                            onError?.();
                        }}
                    />
                ) : (
                    <UserAvatar source={fallbackSource} initials={initials} size={160} />
                )}
                <button
                    type="button"
                    aria-label={t('common.closeModal')}
                    onClick={withTapHaptic(onClose)}
                    style={{
                        position: 'absolute',
                        top: Spacing.lg,
                        right: Spacing.lg,
                        width: TouchTarget.min,
                        height: TouchTarget.min,
                    }}
                >
                    <CloseIcon size={24} color={colors.white} />
                </button>
            </div>
        </div>
    );
}

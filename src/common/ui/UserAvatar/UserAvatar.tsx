import React, { useState } from 'react';
import { absoluteFill, css, imageSrc, type ImageSource } from '@/common/css';
import { BorderRadius, IconSize, Typography, useColors, useThemedStyles, type ThemeColors } from '@theme';

export type UserAvatarProps = {
    source?: ImageSource;
    fallbackSource?: ImageSource;
    initials?: string;
    onError?: () => void;
    size: number;
};

function photoSourceKey(source: ImageSource | undefined): string {
    if (typeof source === 'string' || typeof source === 'number') {
        return String(source);
    }
    if (source && typeof source === 'object') {
        return source.uri ?? '';
    }
    return '';
}

/**
 * Circular avatar: custom photo, then initials, then optional gender art.
 * Never renders as an empty gray disk when initials are provided.
 * Remounts when the photo source changes so a failed load does not stick.
 */
export function UserAvatar(props: UserAvatarProps): React.JSX.Element {
    return <UserAvatarView key={photoSourceKey(props.source)} {...props} />;
}

function UserAvatarView({ source, fallbackSource, initials, onError, size }: UserAvatarProps): React.JSX.Element {
    const colors = useColors();
    const styles = useThemedStyles(createStyles);
    const [photoFailed, setPhotoFailed] = useState(false);

    const showPhoto = Boolean(source) && !photoFailed;
    const trimmedInitials = initials?.trim() ?? '';
    const showInitials = !showPhoto && trimmedInitials.length > 0;
    const showFallback = !showPhoto && !showInitials && Boolean(fallbackSource);
    const initialsStyle = size >= IconSize.badge ? styles.initialsLg : styles.initials;

    const handlePhotoError = () => {
        setPhotoFailed(true);
        onError?.();
    };

    return (
        <div
            style={css(styles.ring, {
                width: size,
                height: size,
                backgroundColor: showInitials ? colors.primarySoft : colors.onboardingAvatar,
            })}
        >
            {showPhoto && source ? (
                <img
                    src={imageSrc(source)}
                    alt=""
                    style={{ ...styles.image, objectFit: 'cover' }}
                    onError={handlePhotoError}
                />
            ) : null}
            {showFallback && fallbackSource ? (
                <img src={imageSrc(fallbackSource)} alt="" style={{ ...styles.image, objectFit: 'contain' }} />
            ) : null}
            {showInitials ? (
                <span style={initialsStyle} aria-label={trimmedInitials}>
                    {trimmedInitials}
                </span>
            ) : null}
        </div>
    );
}

const createStyles = (colors: ThemeColors) => ({
    ring: {
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        ...absoluteFill,
    },
    initials: {
        ...Typography.avatarInitials,
        color: colors.primary,
    },
    initialsLg: {
        ...Typography.avatarInitialsLg,
        color: colors.primary,
    },
});

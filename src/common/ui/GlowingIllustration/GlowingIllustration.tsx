import React from 'react';
import { absoluteFill, css, imageSrc, type ImageSource, type StyleProp, type ViewStyle } from '@/common/css';
import { t } from '@i18n';
import { Colors } from '@theme';
import wakeTimeSun from '../../../../public/assets/images/wakeTimeSun.jpg';

const IMAGE_SIZE = 240;
const FLOAT_DISTANCE = 14;
const FLOAT_DURATION_MS = 2400;

type GlowingIllustrationProps = {
    source?: ImageSource;
    glowColor?: string;
    width?: number;
    height?: number;
    imageSize?: number;
    floatDistance?: number;
    floatDurationMs?: number;
    accessibilityLabel?: string;
    style?: StyleProp<ViewStyle>;
};

/** Illustration floating over a radial glow. */
export function GlowingIllustration({
    source = wakeTimeSun,
    glowColor = Colors.wakeTimeGlow,
    width = 340,
    height = 340,
    imageSize = IMAGE_SIZE,
    floatDistance = FLOAT_DISTANCE,
    floatDurationMs = FLOAT_DURATION_MS,
    accessibilityLabel = t('onboarding.sunriseA11y'),
    style,
}: GlowingIllustrationProps): React.JSX.Element {
    const glowRadius = Math.min(width, height) / 2;
    const gradientId = `glow${glowColor.replace(/[^a-zA-Z0-9]/g, '')}`;
    const src = imageSrc(source);

    return (
        <div
            role="img"
            aria-label={accessibilityLabel}
            style={css({ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center' }, style)}
        >
            <svg style={absoluteFill} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <defs>
                    <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={glowColor} stopOpacity="0.55" />
                        <stop offset="45%" stopColor={glowColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <circle cx={width / 2} cy={height / 2} r={glowRadius} fill={`url(#${gradientId})`} />
            </svg>
            {src ? (
                <img
                    src={src}
                    alt=""
                    width={imageSize}
                    height={imageSize}
                    style={{
                        objectFit: 'contain',
                        animation: `hydrofit-float ${floatDurationMs * 2}ms ease-in-out infinite`,
                        ['--hydrofit-float' as string]: `${floatDistance}px`,
                    }}
                />
            ) : null}
        </div>
    );
}

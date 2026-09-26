import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

const CLIP_ID = 'maleImage_clip';

const TEAL_BG = Colors.cyanBright;
const SKIN = Colors.illustrationSkin;
const SKIN_SHADOW = Colors.illustrationSkinShadow;
const HAIR = Colors.illustrationHair;
const HEADBAND_STRIPE = Colors.sky;
const WHITE = Colors.white;
const ARMBAND = Colors.gray200;
const EYE = Colors.illustrationEye;
const MOUTH = Colors.terracotta;
const STUBBLE = Colors.illustrationStubble;

const VIEWBOX = 160;
const DEFAULT_SIZE = 56;

type MaleImageProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    width?: number;
    height?: number;
};

/**
 * Circular male fitness avatar.
 */
export function MaleImage({
    width = DEFAULT_SIZE,
    height = DEFAULT_SIZE,
    color = Colors.primary,
    ...props
}: MaleImageProps): React.JSX.Element {
    const tankBlue = color as string;
    const tankOrange = Colors.accentOrange;

    return (
        <svg width={width} height={height} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} fill="none" {...props}>
            <defs>
                <clipPath id={CLIP_ID}>
                    <circle cx={80} cy={80} r={80} />
                </clipPath>
            </defs>
            <g clipPath={`url(#${CLIP_ID})`}>
                <circle cx={80} cy={80} r={80} fill={TEAL_BG} />

                {/* Torso / tank */}
                <path
                    d="M18 160 L16 116 C18 102 36 96 54 94 L70 92 H90 L106 94 C124 96 142 102 144 116 L142 160 Z"
                    fill={tankBlue}
                />
                <path d="M18 160 L16 116 C18 108 26 102 38 100 L44 160 Z" fill={tankOrange} />
                <path d="M142 160 L144 116 C142 108 134 102 122 100 L116 160 Z" fill={tankOrange} />
                <path
                    d="M58 94 C60 104 68 110 80 110 C92 110 100 104 102 94"
                    stroke={WHITE}
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Left arm + sweatband (viewer's right) */}
                <ellipse cx={128} cy={128} rx={18} ry={22} fill={SKIN} />
                <rect x={114} y={122} width={28} height={10} rx={5} fill={ARMBAND} />

                {/* Neck */}
                <path
                    d="M66 90 C66 90 68 110 80 110 C92 110 94 90 94 90 V102 C94 112 88 118 80 118 C72 118 66 112 66 102 Z"
                    fill={SKIN}
                />
                <path d="M70 108 C74 112 86 112 90 108" stroke={SKIN_SHADOW} strokeWidth={1.5} strokeLinecap="round" />

                {/* Ears */}
                <circle cx={48} cy={68} r={8} fill={SKIN} />
                <circle cx={112} cy={68} r={8} fill={SKIN} />
                <circle cx={48} cy={68} r={4.5} fill={SKIN_SHADOW} />
                <circle cx={112} cy={68} r={4.5} fill={SKIN_SHADOW} />

                {/* Hair (behind headband) */}
                <circle cx={54} cy={28} r={12} fill={HAIR} />
                <circle cx={70} cy={22} r={13} fill={HAIR} />
                <circle cx={88} cy={22} r={13} fill={HAIR} />
                <circle cx={106} cy={28} r={12} fill={HAIR} />
                <circle cx={46} cy={42} r={10} fill={HAIR} />
                <circle cx={114} cy={42} r={10} fill={HAIR} />
                <circle cx={80} cy={20} r={11} fill={HAIR} />

                {/* Head */}
                <circle cx={80} cy={64} r={30} fill={SKIN} />

                {/* Headband */}
                <rect x={50} y={46} width={60} height={14} rx={5} fill={tankOrange} />
                <rect x={50} y={50.5} width={60} height={5} fill={HEADBAND_STRIPE} />

                {/* Front hair curls over the band */}
                <circle cx={62} cy={26} r={9} fill={HAIR} />
                <circle cx={80} cy={24} r={9} fill={HAIR} />
                <circle cx={98} cy={26} r={9} fill={HAIR} />

                {/* Stubble */}
                <ellipse cx={80} cy={86} rx={16} ry={8} fill={STUBBLE} opacity={0.55} />

                {/* Brows */}
                <path d="M62 56 Q68 52 74 56" stroke={EYE} strokeWidth={2.4} strokeLinecap="round" fill="none" />
                <path d="M86 56 Q92 52 98 56" stroke={EYE} strokeWidth={2.4} strokeLinecap="round" fill="none" />

                {/* Eyes */}
                <circle cx={68} cy={66} r={6} fill={EYE} />
                <circle cx={92} cy={66} r={6} fill={EYE} />
                <circle cx={70} cy={64} r={2} fill={WHITE} />
                <circle cx={94} cy={64} r={2} fill={WHITE} />

                {/* Nose */}
                <ellipse cx={80} cy={74} rx={4.5} ry={3.5} fill={SKIN_SHADOW} />

                {/* Smile */}
                <path d="M66 82 Q80 96 94 82 Q80 90 66 82 Z" fill={MOUTH} />
                <path d="M70 83 Q80 90 90 83 Q80 86 70 83 Z" fill={WHITE} />

                {/* Chest logo */}
                <circle cx={98} cy={124} r={7} fill={WHITE} />
                <path d="M99 118.5 L95.5 124.5 H99 L96.5 129.5 L103.5 123.5 H100 L102.5 118.5 Z" fill={tankBlue} />
            </g>
        </svg>
    );
}

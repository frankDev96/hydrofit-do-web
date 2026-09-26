import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

type GenderOptionIconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number;
    color?: string;
};

/** Mars symbol — circle with a north-east arrow. */
export function GenderMaleIcon({
    size = 24,
    color = Colors.onboardingMuted,
    ...props
}: GenderOptionIconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={9.5} cy={14.5} r={5.25} stroke={color} strokeWidth={2} />
            <path d="M14 5h6v6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 5 13.75 11.25" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
    );
}

/** Venus symbol — circle with a south stem and crossbar. */
export function GenderFemaleIcon({
    size = 24,
    color = Colors.onboardingMuted,
    ...props
}: GenderOptionIconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={9} r={5.25} stroke={color} strokeWidth={2} />
            <path d="M12 14.25v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
            <path d="M9 17.5h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
    );
}

/** Neuter symbol — circle with a south stem, matching male/female stroke weight. */
export function GenderUnspecifiedIcon({
    size = 24,
    color = Colors.onboardingMuted,
    ...props
}: GenderOptionIconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={10} r={5.25} stroke={color} strokeWidth={2} />
            <path d="M12 15.25v5" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
    );
}

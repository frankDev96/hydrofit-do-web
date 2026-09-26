import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 15×15 biometric / HealthKit step icon */
export function CalculationBioIcon({
    width = 15,
    height = 15,
    color = Colors.primary,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 15 15" fill="none" {...props}>
            <circle cx="7.5" cy="7.5" r="6.25" stroke={color as string} strokeWidth="1.5" />
            <path
                d="M4.5 7.75L6.5 9.75L10.5 5.25"
                stroke={color as string}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

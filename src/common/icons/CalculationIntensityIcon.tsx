import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 16×20 intensity / bolt insight icon */
export function CalculationIntensityIcon({
    width = 16,
    height = 20,
    color = Colors.primary,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 16 20" fill="none" {...props}>
            <path
                d="M6.55 16.2L11.725 10H7.725L8.45 4.325L3.825 11H7.3L6.55 16.2ZM4 20L5 13H0L9 0H11L10 8H16L6 20H4Z"
                fill={color as string}
            />
        </svg>
    );
}

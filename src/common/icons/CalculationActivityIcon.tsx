import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 16×20 activity / sweat insight icon */
export function CalculationActivityIcon({
    width = 16,
    height = 20,
    color = Colors.accentOrange,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 16 20" fill="none" {...props}>
            <path d="M8.75 1.5L3.5 10.75H7.25L6.5 18.5L12.5 8.5H8.75L8.75 1.5Z" fill={color as string} />
        </svg>
    );
}

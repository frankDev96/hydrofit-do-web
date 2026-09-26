import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 16×20 CalculationRecoveryIcon icon */
export function CalculationRecoveryIcon({
    width = 16,
    height = 20,
    color = Colors.primary,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 16 20" fill="none" {...props}>
            <path
                d="M20.75 19.8L14.15 13.2L11.3 16.05L5.65 10.4L7.05 8.95L11.3 13.2L12.7 11.8L2.35 1.45L3.75 0L22.15 18.4L20.75 19.8V19.8M5.65 16.05L0 10.4L1.4 9L5.65 13.25V13.25L7.05 14.65L5.65 16.05V16.05M16.95 10.4L15.55 9L20.45 4.1L21.9 5.45L16.95 10.4V10.4M14.1 7.55L12.7 6.15L14.85 4L16.25 5.4L14.1 7.55V7.55"
                fill={color as string}
            />
        </svg>
    );
}

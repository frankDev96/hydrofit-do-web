import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 16×16 gender mark from the profile bio Figma. */
export function GenderCommonIcon({
    width = 16,
    height = 16,
    color = Colors.primaryDeepMuted,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 16 16" fill="none" {...props}>
            <path
                d="M16 0V6H14V3.425L10.025 7.375C10.3417 7.84167 10.5833 8.3375 10.75 8.8625C10.9167 9.3875 11 9.93333 11 10.5C11 12.0333 10.4667 13.3333 9.4 14.4C8.33333 15.4667 7.03333 16 5.5 16C3.96667 16 2.66667 15.4667 1.6 14.4C0.533333 13.3333 0 12.0333 0 10.5C0 8.96667 0.533333 7.66667 1.6 6.6C2.66667 5.53333 3.96667 5 5.5 5C6.05 5 6.59167 5.07917 7.125 5.2375C7.65833 5.39583 8.15 5.64167 8.6 5.975L12.575 2H10V0H16ZM5.5 7C4.53333 7 3.70833 7.34167 3.025 8.025C2.34167 8.70833 2 9.53333 2 10.5C2 11.4667 2.34167 12.2917 3.025 12.975C3.70833 13.6583 4.53333 14 5.5 14C6.46667 14 7.29167 13.6583 7.975 12.975C8.65833 12.2917 9 11.4667 9 10.5C9 9.53333 8.65833 8.70833 7.975 8.025C7.29167 7.34167 6.46667 7 5.5 7Z"
                fill={color}
            />
        </svg>
    );
}

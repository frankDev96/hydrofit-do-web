import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 15×17 flag mark from the profile bio Figma. */
export function DailyGoalCommonIcon({
    width = 15,
    height = 17,
    color = Colors.primaryDeepMuted,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 15 17" fill="none" {...props}>
            <path d="M0 17V0H9L9.4 2H15V12H8L7.6 10H2V17H0Z" fill={color} />
        </svg>
    );
}

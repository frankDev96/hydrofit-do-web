import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

/** 20×12 trending-up level mark from the profile stats Figma. */
export function LevelIcon({
    width = 20,
    height = 12,
    color = Colors.primaryDeep,
    ...props
}: SVGProps<SVGSVGElement>): React.JSX.Element {
    return (
        <svg width={width} height={height} viewBox="0 0 20 12" fill="none" {...props}>
            <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill={color} />
        </svg>
    );
}

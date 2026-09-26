import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

const FILTER_ID = 'waterDropIcon_filter0_d';

export function WaterDropIcon({
    width = 160,
    height = 160,
    color = Colors.primary,
    ...props
}: SVGProps<SVGSVGElement>) {
    const fill = color as string;

    return (
        <svg width={width} height={height} viewBox="0 0 160 160" fill="none" {...props}>
            <g filter={`url(#${FILTER_ID})`}>
                <rect x="40" y="40" width="80" height="80" rx="40" fill={fill} fillOpacity={0.1} />
                <rect x="40.5" y="40.5" width="79" height="79" rx="39.5" stroke={fill} strokeOpacity={0.2} />
                <path
                    d="M80.4583 91.6667C80.7917 91.6389 81.0764 91.507 81.3125 91.2709C81.5486 91.0348 81.6667 90.75 81.6667 90.4167C81.6667 90.0278 81.5417 89.7153 81.2917 89.4792C81.0417 89.2431 80.7222 89.1389 80.3333 89.1667C79.1945 89.25 77.9861 88.9375 76.7083 88.2292C75.4306 87.5209 74.625 86.2362 74.2917 84.375C74.2361 84.0695 74.0903 83.8195 73.8542 83.625C73.6181 83.4306 73.3472 83.3334 73.0417 83.3334C72.6528 83.3334 72.3333 83.4792 72.0833 83.7709C71.8333 84.0625 71.75 84.4028 71.8333 84.7917C72.3056 87.3195 73.4167 89.125 75.1667 90.2084C76.9167 91.2917 78.6806 91.7778 80.4583 91.6667ZM80 96.6667C76.1944 96.6667 73.0208 95.3612 70.4792 92.75C67.9375 90.1389 66.6667 86.8889 66.6667 83C66.6667 80.2223 67.7708 77.2014 69.9792 73.9375C72.1875 70.6737 75.5278 67.1389 80 63.3334C84.4722 67.1389 87.8125 70.6737 90.0208 73.9375C92.2292 77.2014 93.3333 80.2223 93.3333 83C93.3333 86.8889 92.0625 90.1389 89.5208 92.75C86.9792 95.3612 83.8056 96.6667 80 96.6667Z"
                    fill={fill}
                />
            </g>
            <defs>
                <filter id={FILTER_ID} x="0" y="0" width="160" height="160" filterUnits="userSpaceOnUse">
                    <feFlood floodOpacity={0} result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="20" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.466667 0 0 0 0 1 0 0 0 0.1 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2001_8" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2001_8" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

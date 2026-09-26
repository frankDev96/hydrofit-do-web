import React, { type SVGProps } from 'react';
import { Colors } from '@theme';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
    size?: number;
    color?: string;
    filled?: boolean;
};

export function HomeTabIcon({
    size = 20,
    color = Colors.textMuted,
    filled = false,
    ...props
}: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function StatsTabIcon({
    size = 20,
    color = Colors.textMuted,
    filled = false,
    ...props
}: IconProps): React.JSX.Element {
    if (filled) {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
                <path d="M5 14H8V20H5V14ZM10.5 4H13.5V20H10.5V4ZM16 10H19V20H16V10Z" fill={color} />
            </svg>
        );
    }

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M18 20V10M12 20V4M6 20V14"
                stroke={color}
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PlanTabIcon({
    size = 20,
    color = Colors.textMuted,
    filled = false,
    ...props
}: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 12L11 14L15 10M9 17H15"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ProfileTabIcon({
    size = 20,
    color = Colors.textMuted,
    filled = false,
    ...props
}: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                fill={filled ? color : 'none'}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CalendarActionIcon({ size = 20, color = Colors.primary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
    );
}

export function TrendUpIcon({ size = 14, color = Colors.teal, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
            <path
                d="M3 11L7.5 6.5L10.5 9.5L14 4M14 4H10M14 4V8"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function FlameStreakIcon({
    size = 14,
    width,
    height,
    color = Colors.warning,
    ...props
}: IconProps & { width?: number; height?: number }): React.JSX.Element {
    const iconWidth = width ?? size;
    const iconHeight = height ?? Math.round((iconWidth * 18) / 16);

    return (
        <svg width={iconWidth} height={iconHeight} viewBox="0 0 16 18" fill="none" {...props}>
            <path
                d="M0 11C0 9.25 0.416667 7.69167 1.25 6.325C2.08333 4.95833 3 3.80833 4 2.875C5 1.94167 5.91667 1.22917 6.75 0.7375C7.58333 0.245833 8 0 8 0V3.3C8 3.91667 8.20833 4.40417 8.625 4.7625C9.04167 5.12083 9.50833 5.3 10.025 5.3C10.3083 5.3 10.5792 5.24167 10.8375 5.125C11.0958 5.00833 11.3333 4.81667 11.55 4.55L12 4C13.2 4.7 14.1667 5.67083 14.9 6.9125C15.6333 8.15417 16 9.51667 16 11C16 12.4667 15.6417 13.8042 14.925 15.0125C14.2083 16.2208 13.2667 17.175 12.1 17.875C12.3833 17.475 12.6042 17.0375 12.7625 16.5625C12.9208 16.0875 13 15.5833 13 15.05C13 14.3833 12.875 13.7542 12.625 13.1625C12.375 12.5708 12.0167 12.0417 11.55 11.575L8 8.1L4.475 11.575C3.99167 12.0583 3.625 12.5917 3.375 13.175C3.125 13.7583 3 14.3833 3 15.05C3 15.5833 3.07917 16.0875 3.2375 16.5625C3.39583 17.0375 3.61667 17.475 3.9 17.875C2.73333 17.175 1.79167 16.2208 1.075 15.0125C0.358333 13.8042 0 12.4667 0 11ZM8 10.9L10.125 12.975C10.4083 13.2583 10.625 13.575 10.775 13.925C10.925 14.275 11 14.65 11 15.05C11 15.8667 10.7083 16.5625 10.125 17.1375C9.54167 17.7125 8.83333 18 8 18C7.16667 18 6.45833 17.7125 5.875 17.1375C5.29167 16.5625 5 15.8667 5 15.05C5 14.6667 5.075 14.2958 5.225 13.9375C5.375 13.5792 5.59167 13.2583 5.875 12.975L8 10.9Z"
                fill={color}
            />
        </svg>
    );
}

export function SettingsIcon({ size = 22, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.4 15A1.65 1.65 0 0 0 20 16.27V17A2 2 0 0 1 18 19H17.27A1.65 1.65 0 0 0 16 19.4A1.65 1.65 0 0 0 15 20.65V21A2 2 0 0 1 13 23H11A2 2 0 0 1 9 21V20.65A1.65 1.65 0 0 0 8 19.4A1.65 1.65 0 0 0 6.73 19H6A2 2 0 0 1 4 17V16.27A1.65 1.65 0 0 0 3.4 15A1.65 1.65 0 0 0 2.15 14H2A2 2 0 0 1 0 12A2 2 0 0 1 2 10H2.15A1.65 1.65 0 0 0 3.4 9A1.65 1.65 0 0 0 4 7.73V7A2 2 0 0 1 6 5H6.73A1.65 1.65 0 0 0 8 4.6A1.65 1.65 0 0 0 9 3.35V3A2 2 0 0 1 11 1H13A2 2 0 0 1 15 3V3.35A1.65 1.65 0 0 0 16 4.6A1.65 1.65 0 0 0 17.27 5H18A2 2 0 0 1 20 7V7.73A1.65 1.65 0 0 0 20.6 9A1.65 1.65 0 0 0 21.85 10H22A2 2 0 0 1 24 12A2 2 0 0 1 22 14H21.85A1.65 1.65 0 0 0 20.6 15A1.65 1.65 0 0 0 19.4 15Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ChevronRightIcon({ size = 16, color = Colors.border, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 10 10" fill="none" {...props}>
            <path
                d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
                fill={color as string}
            />
        </svg>
    );
}

export function ArrowBackIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function MoreVerticalIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SoundIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M11 5L6 9H2V15H6L11 19V5Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function VibrationIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M2 8V16M6 5V19M18 5V19M22 8V16M10 4H14C15.1046 4 16 4.89543 16 6V18C16 19.1046 15.1046 20 14 20H10C8.89543 20 8 19.1046 8 18V6C8 4.89543 8.89543 4 10 4Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SparklesIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function MoonIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function UnitRulerIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M3 21L21 3M13 5L15 7M9 9L11 11M5 13L7 15M21 7L17 3M7 21L3 17"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function GlobeIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke={color}
                strokeWidth={2}
            />
            <path
                d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                stroke={color}
                strokeWidth={2}
            />
        </svg>
    );
}

export function MapPinIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22C12 22 19 16.5 19 10.5C19 6.35786 15.866 3 12 3C8.13401 3 5 6.35786 5 10.5C5 16.5 12 22 12 22Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SunIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                stroke={color}
                strokeWidth={2}
            />
            <path
                d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </svg>
    );
}

export function BedIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M2 19V7M2 17H22M22 19V12C22 10.6739 21.4732 9.40215 20.5355 8.46447C19.5979 7.52678 18.3261 7 17 7H12C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12V17M7 11C7 11.5304 6.78929 12.0391 6.41421 12.4142C6.03914 12.7893 5.53043 13 5 13C4.46957 13 3.96086 12.7893 3.58579 12.4142C3.21071 12.0391 3 11.5304 3 11C3 10.4696 3.21071 9.96086 3.58579 9.58579C3.96086 9.21071 4.46957 9 5 9C5.53043 9 6.03914 9.21071 6.41421 9.58579C6.78929 9.96086 7 10.4696 7 11Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ShieldLockIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function DocumentTextIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </svg>
    );
}

export function HelpCircleIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke={color}
                strokeWidth={2}
            />
            <path
                d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.39913C11.0108 7.03015 11.7289 6.87898 12.4372 6.97003C13.1455 7.06107 13.7997 7.38885 14.292 7.89972C14.7843 8.41059 15.084 9.07185 15.1424 9.77546C15.2008 10.4791 15.0142 11.1818 14.6133 11.7674C14.2124 12.353 13.6221 12.7844 12.94 13C12.39 13.18 12 13.72 12 14.3V15"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
            <path d="M12 18H12.01" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </svg>
    );
}

export function InfoCircleIcon({ size = 20, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke={color}
                strokeWidth={2}
            />
            <path d="M12 16V12M12 8H12.01" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        </svg>
    );
}

export function BellIcon({ size = 20, color = Colors.text, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13.73 21A2 2 0 0 1 10.27 21"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PlusIcon({ size = 16, color = Colors.text, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M12 5V19M5 12H19" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function MinusIcon({ size = 16, color = Colors.text, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M5 12H19" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function ClockOutlineIcon({ size = 20, color = Colors.iconNavy, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M12 6V12L16 14" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function CloseIcon({ size = 14, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 14 14" fill="none" {...props}>
            <path
                d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                fill={color}
            />
        </svg>
    );
}

export function CheckIcon({ size = 16, color = Colors.primary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function RefreshIcon({ size = 16, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M21 12a9 9 0 0 0-15-6.7L3 8M3 3v5h5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 12a9 9 0 0 0 15 6.7L21 16M21 21v-5h-5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function PencilIcon({ size = 16, color = Colors.textSecondary, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M12 20H21M16.5 3.5C16.8978 3.10217 17.4374 2.87868 18 2.87868C18.2786 2.87868 18.5544 2.93355 18.8118 3.04015C19.0692 3.14676 19.303 3.30301 19.5 3.5C19.697 3.69698 19.8532 3.93083 19.9598 4.1882C20.0665 4.44557 20.1213 4.72142 20.1213 5C20.1213 5.27858 20.0665 5.55442 19.9598 5.8118C19.8532 6.06917 19.697 6.30301 19.5 6.5L7 19L3 20L4 16L16.5 3.5Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function SearchIcon({ size = 18, color = Colors.border, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M21 21L16.65 16.65" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function LightbulbIcon({ size = 20, color = Colors.white, ...props }: IconProps): React.JSX.Element {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M9 18H15M10 22H14M12 2C8.13401 2 5 5.13401 5 9C5 11.3869 6.19799 13.4988 8.00035 14.7423C8.61868 15.1691 9 15.864 9 16.6117V17C9 17.5523 9.44772 18 10 18H14C14.5523 18 15 17.5523 15 17V16.6117C15 15.864 15.3813 15.1691 15.9997 14.7423C17.802 13.4988 19 11.3869 19 9C19 5.13401 15.866 2 12 2Z"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

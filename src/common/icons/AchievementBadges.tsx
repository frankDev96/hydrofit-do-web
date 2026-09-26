import React from 'react';
import { IconSize } from '@theme';

export type AchievementBadgeId = 'first-drop' | 'target-smasher' | 'habit-starter' | 'early-bird' | 'centurion';

export type AchievementBadgeIconProps = {
    id: AchievementBadgeId;
    size?: number;
};

const BADGE_SRC: Record<AchievementBadgeId, string> = {
    'first-drop': '/assets/images/achievements/first-drop.png',
    'target-smasher': '/assets/images/achievements/target-smasher.png',
    'habit-starter': '/assets/images/achievements/habit-starter.png',
    'early-bird': '/assets/images/achievements/early-bird.png',
    centurion: '/assets/images/achievements/centurion.png',
};

export const ACHIEVEMENT_BADGE_SOURCES = BADGE_SRC;

export function AchievementBadgeIcon({ id, size = IconSize.badge }: AchievementBadgeIconProps): React.JSX.Element {
    return <img src={BADGE_SRC[id]} alt="" width={size} height={size} style={{ objectFit: 'contain' }} />;
}

export function FirstDropBadgeIcon({ size }: { size?: number }): React.JSX.Element {
    return <AchievementBadgeIcon id="first-drop" size={size} />;
}

export function TargetSmasherBadgeIcon({ size }: { size?: number }): React.JSX.Element {
    return <AchievementBadgeIcon id="target-smasher" size={size} />;
}

export function HabitStarterBadgeIcon({ size }: { size?: number }): React.JSX.Element {
    return <AchievementBadgeIcon id="habit-starter" size={size} />;
}

export function EarlyBirdBadgeIcon({ size }: { size?: number }): React.JSX.Element {
    return <AchievementBadgeIcon id="early-bird" size={size} />;
}

export function CenturionBadgeIcon({ size }: { size?: number }): React.JSX.Element {
    return <AchievementBadgeIcon id="centurion" size={size} />;
}

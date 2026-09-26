import React from 'react';
import { render } from '@/test-utils/render';
import { describe, expect, it } from 'vitest';
import {
    CalendarActionIcon,
    FlameStreakIcon,
    HomeTabIcon,
    PlanTabIcon,
    ProfileTabIcon,
    RefreshIcon,
    StatsTabIcon,
    TrendUpIcon,
} from './NavAndStatsIcons';
import { CalculationActivityIcon } from './CalculationActivityIcon';
import { CalculationBioIcon } from './CalculationBioIcon';
import { CalculationPulseIcon } from './CalculationPulseIcon';
import { CalculationScheduleIcon } from './CalculationScheduleIcon';
import { CalculationGoalIcon } from './CalculationGoalIcon';
import { CalculationIntensityIcon } from './CalculationIntensityIcon';
import { CalculationRecoveryIcon } from './CalculationRecoveryIcon';
import { DailyGoalCommonIcon } from './DailyGoalCommonIcon';
import { GenderCommonIcon } from './GenderCommonIcon';
import { GenderFemaleIcon, GenderMaleIcon, GenderUnspecifiedIcon } from './GenderOptionIcons';
import { GenderSelectIcon } from './GenderSelectIcon';
import { LevelIcon } from './LevelIcon';
import { WaterDropletIcon } from './WaterDropletIcon';
import { WaterDropIcon } from './WaterDropIcon';
import { WeightCommonIcon } from './WeightCommonIcon';
import { WeightPickerIcon } from './WeightPickerIcon';
import { WakeTimePickerIcon } from './WakeTimePickerIcon';
import { BedTimePickerIcon } from './BedTimePickerIcon';
import { CupGlassSelectorIcon } from './CupGlassSelectorIcon';
import { GlowShadeIcon } from './GlowShadeIcon';
import {
    CenturionBadgeIcon,
    EarlyBirdBadgeIcon,
    FirstDropBadgeIcon,
    HabitStarterBadgeIcon,
    TargetSmasherBadgeIcon,
} from './AchievementBadges';

describe('Icons', () => {
    it('renders all nav and stats icons correctly', () => {
        expect(() => render(<HomeTabIcon filled />)).not.toThrow();
        expect(() => render(<StatsTabIcon filled />)).not.toThrow();
        expect(() => render(<PlanTabIcon filled />)).not.toThrow();
        expect(() => render(<ProfileTabIcon filled />)).not.toThrow();
        expect(() => render(<CalendarActionIcon />)).not.toThrow();
        expect(() => render(<TrendUpIcon />)).not.toThrow();
        expect(() => render(<FlameStreakIcon />)).not.toThrow();
        expect(() => render(<RefreshIcon />)).not.toThrow();
        expect(() => render(<LevelIcon />)).not.toThrow();
        expect(() => render(<WaterDropletIcon />)).not.toThrow();
        expect(() => render(<WaterDropIcon />)).not.toThrow();
        expect(() => render(<GenderCommonIcon />)).not.toThrow();
        expect(() => render(<GenderMaleIcon />)).not.toThrow();
        expect(() => render(<GenderFemaleIcon />)).not.toThrow();
        expect(() => render(<GenderUnspecifiedIcon />)).not.toThrow();
        expect(() => render(<GenderSelectIcon />)).not.toThrow();
        expect(() => render(<WeightCommonIcon />)).not.toThrow();
        expect(() => render(<WeightPickerIcon />)).not.toThrow();
        expect(() => render(<WakeTimePickerIcon />)).not.toThrow();
        expect(() => render(<BedTimePickerIcon />)).not.toThrow();
        expect(() => render(<CupGlassSelectorIcon />)).not.toThrow();
        expect(() => render(<GlowShadeIcon />)).not.toThrow();
        expect(() => render(<DailyGoalCommonIcon />)).not.toThrow();
        expect(() => render(<FirstDropBadgeIcon />)).not.toThrow();
        expect(() => render(<TargetSmasherBadgeIcon />)).not.toThrow();
        expect(() => render(<HabitStarterBadgeIcon />)).not.toThrow();
        expect(() => render(<EarlyBirdBadgeIcon />)).not.toThrow();
        expect(() => render(<CenturionBadgeIcon />)).not.toThrow();
    });

    it('renders calculation icons correctly', () => {
        expect(() => render(<CalculationActivityIcon />)).not.toThrow();
        expect(() => render(<CalculationBioIcon />)).not.toThrow();
        expect(() => render(<CalculationPulseIcon />)).not.toThrow();
        expect(() => render(<CalculationScheduleIcon />)).not.toThrow();
        expect(() => render(<CalculationGoalIcon />)).not.toThrow();
        expect(() => render(<CalculationIntensityIcon />)).not.toThrow();
        expect(() => render(<CalculationRecoveryIcon />)).not.toThrow();
    });
});

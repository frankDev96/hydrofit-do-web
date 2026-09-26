import { describe, expect, it } from 'vitest';
import { INTAKE_QUICK_PRESETS } from '@common/constants';
import { toLocalDateKey } from '@common/utils';
import { buildReminderHudSnapshot } from './reminderHudSnapshot';

describe('buildReminderHudSnapshot', () => {
    it('hides the placeholder target until onboarding is complete', () => {
        const snapshot = buildReminderHudSnapshot({
            todayIntakeMl: 0,
            dailyTargetMl: 2310,
            isOnboardingCompleted: false,
        });
        expect(snapshot.intakeTitle).toBe('Set your goal');
        expect(snapshot.intakeCaption).toBe('Finish setup in the app');
        expect(snapshot.dailyTargetMl).toBe(0);
        expect(snapshot.dateKey).toBe(toLocalDateKey());
        expect(snapshot.chipAmounts).toEqual([...INTAKE_QUICK_PRESETS]);
        expect(snapshot.chipLabels).toEqual(['150ml', '250ml', '500ml', '750ml']);
    });

    it('shows live intake, remaining, and log chips after onboarding', () => {
        const snapshot = buildReminderHudSnapshot({
            todayIntakeMl: 1250,
            dailyTargetMl: 2400,
            isOnboardingCompleted: true,
        });
        expect(snapshot.intakeTitle).toBe('1250 / 2400 ml');
        expect(snapshot.intakeCaption).toBe('1150 ml left');
        expect(snapshot.reminderTitle).toBe('Time to hydrate');
        expect(snapshot.snoozeLabel).toBe('Snooze');
        expect(snapshot.openLabel).toBe('Open');
    });

    it('uses goal-reached caption and keeps post-goal tray strings ready at 100%', () => {
        const snapshot = buildReminderHudSnapshot({
            todayIntakeMl: 2400,
            dailyTargetMl: 2400,
            isOnboardingCompleted: true,
        });
        expect(snapshot.intakeCaption).toBe('Goal reached');
        expect(snapshot.reminderTitle).toBe('Time to hydrate');
        expect(snapshot.postGoalReminderTitle).toBe('Stay hydrated');
        expect(snapshot.postGoalReminderBody).toContain("You've hit today's goal");
    });
});

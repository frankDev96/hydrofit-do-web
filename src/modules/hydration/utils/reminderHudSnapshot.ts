import { INTAKE_QUICK_PRESETS } from '@common/constants';
import { toLocalDateKey } from '@common/utils';
import { t } from '@i18n';

export type ReminderHudSnapshot = {
    dateKey: string;
    todayIntakeMl: number;
    dailyTargetMl: number;
    isOnboardingCompleted: boolean;
    reminderTitle: string;
    reminderBody: string;
    postGoalReminderTitle: string;
    postGoalReminderBody: string;
    intakeTitle: string;
    intakeCaption: string;
    goalReached: string;
    setupTitle: string;
    setupCaption: string;
    snoozeLabel: string;
    openLabel: string;
    chipLabels: string[];
    chipAmounts: number[];
};

export type ReminderHudInput = {
    todayIntakeMl: number;
    dailyTargetMl: number;
    isOnboardingCompleted: boolean;
    dateKey?: string;
};

function isGoalMet(todayIntakeMl: number, dailyTargetMl: number): boolean {
    return dailyTargetMl > 0 && todayIntakeMl >= dailyTargetMl;
}

function intakeCaption(todayIntakeMl: number, dailyTargetMl: number): string {
    if (isGoalMet(todayIntakeMl, dailyTargetMl)) {
        return t('home.widgetGoalReached');
    }
    return t('home.mlLeft', { amount: Math.max(dailyTargetMl - todayIntakeMl, 0) });
}

/** Localized RemoteViews payload for the timed reminder HUD. */
export function buildReminderHudSnapshot({
    todayIntakeMl,
    dailyTargetMl,
    isOnboardingCompleted,
    dateKey = toLocalDateKey(),
}: ReminderHudInput): ReminderHudSnapshot {
    const reminderTitle = t('notifications.reminderTitle');
    const reminderBody = t('notifications.reminderBody');
    const postGoalReminderTitle = t('notifications.postGoalReminderTitle');
    const postGoalReminderBody = t('notifications.postGoalReminderBody');
    const chipLabels = INTAKE_QUICK_PRESETS.map(amount => t('common.unitMlCompact', { amount }));
    const chipAmounts = [...INTAKE_QUICK_PRESETS];

    if (!isOnboardingCompleted) {
        return {
            dateKey,
            todayIntakeMl,
            dailyTargetMl: 0,
            isOnboardingCompleted: false,
            reminderTitle,
            reminderBody,
            postGoalReminderTitle,
            postGoalReminderBody,
            intakeTitle: t('home.widgetSetupTitle'),
            intakeCaption: t('home.widgetSetupCaption'),
            goalReached: t('home.widgetGoalReached'),
            setupTitle: t('home.widgetSetupTitle'),
            setupCaption: t('home.widgetSetupCaption'),
            snoozeLabel: t('notifications.snooze'),
            openLabel: t('notifications.open'),
            chipLabels,
            chipAmounts,
        };
    }

    return {
        dateKey,
        todayIntakeMl,
        dailyTargetMl,
        isOnboardingCompleted: true,
        reminderTitle,
        reminderBody,
        postGoalReminderTitle,
        postGoalReminderBody,
        intakeTitle: t('home.widgetIntakeOfGoal', { current: todayIntakeMl, target: dailyTargetMl }),
        intakeCaption: intakeCaption(todayIntakeMl, dailyTargetMl),
        goalReached: t('home.widgetGoalReached'),
        setupTitle: t('home.widgetSetupTitle'),
        setupCaption: t('home.widgetSetupCaption'),
        snoozeLabel: t('notifications.snooze'),
        openLabel: t('notifications.open'),
        chipLabels,
        chipAmounts,
    };
}

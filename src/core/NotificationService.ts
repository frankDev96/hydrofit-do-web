import { buildReminderSlots } from '@modules/hydration/utils/nextReminder';
import { deviceStore } from '@stores/storage';
import NavigationService from './NavigationService';

const PERM_KEY = 'notificationPermissionGranted';

export type MilestoneNotificationPayload = {
    id: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    paceChip?: string;
    footerLeft?: string;
    footerRight?: string;
};

export type ReminderAlertStyle = {
    enabled: boolean;
    soundUrl?: string;
    vibration: boolean;
    importance?: 'high' | 'default';
};

export type ReminderHudNativeSnapshot = {
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

async function requestPermission(): Promise<boolean> {
    if (typeof Notification === 'undefined') {
        deviceStore.set(PERM_KEY, false);
        return false;
    }
    const result = await Notification.requestPermission();
    const granted = result === 'granted';
    deviceStore.set(PERM_KEY, granted);
    return granted;
}

async function refreshPermissionStatus(): Promise<boolean> {
    if (typeof Notification === 'undefined') return false;
    const granted = Notification.permission === 'granted';
    deviceStore.set(PERM_KEY, granted);
    return granted;
}

function isPermissionGranted(): boolean {
    return deviceStore.getBoolean(PERM_KEY) ?? false;
}

async function scheduleHydrationReminders(
    wakeTime: string,
    bedTime: string,
    intervalHours: number,
    alertStyle?: Partial<ReminderAlertStyle>,
): Promise<void> {
    if (alertStyle?.enabled === false) {
        await cancelAll();
        return;
    }
    buildReminderSlots(wakeTime, bedTime, intervalHours);
}

async function writeHudSnapshot(_snapshot: ReminderHudNativeSnapshot): Promise<void> {
    return undefined;
}

function enqueuePendingNav(data: Record<string, unknown>): void {
    NavigationService.handleNotificationPress(data);
}

async function displayMilestone(payload: MilestoneNotificationPayload): Promise<void> {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    new Notification(payload.title, { body: payload.body });
}

async function consumeInitialNotificationPress(): Promise<void> {
    return undefined;
}

async function cancelAll(): Promise<void> {
    return undefined;
}

function resetPressHandlersForTests(): void {
    return undefined;
}

const NotificationService = {
    requestPermission,
    refreshPermissionStatus,
    scheduleHydrationReminders,
    writeHudSnapshot,
    enqueuePendingNav,
    displayMilestone,
    consumeInitialNotificationPress,
    cancelAll,
    isPermissionGranted,
    resetPressHandlersForTests,
};

export default NotificationService;

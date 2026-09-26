import type { ReminderAlertStyle } from '@core/NotificationService';
import type { TranslationKey } from '@i18n';

export const REMINDER_MODE_IDS = ['sound-and-vibrate', 'sound-only', 'vibrate-only', 'display-only', 'off'] as const;

export type ReminderModeId = (typeof REMINDER_MODE_IDS)[number];

export const DEFAULT_REMINDER_MODE: ReminderModeId = 'sound-and-vibrate';

const REMINDER_MODE_LABEL_KEYS: Record<ReminderModeId, TranslationKey> = {
    'sound-and-vibrate': 'settings.reminderModeSoundAndVibrate',
    'sound-only': 'settings.reminderModeSoundOnly',
    'vibrate-only': 'settings.reminderModeVibrateOnly',
    'display-only': 'settings.reminderModeDisplayOnly',
    off: 'settings.reminderModeOff',
};

export function isReminderModeId(value: string | undefined | null): value is ReminderModeId {
    return REMINDER_MODE_IDS.some(id => id === value);
}

export function reminderModeLabelKey(id: ReminderModeId): TranslationKey {
    return REMINDER_MODE_LABEL_KEYS[id] ?? REMINDER_MODE_LABEL_KEYS[DEFAULT_REMINDER_MODE];
}

export function reminderModeUsesSound(mode: ReminderModeId): boolean {
    return mode === 'sound-and-vibrate' || mode === 'sound-only';
}

export function reminderModeUsesVibration(mode: ReminderModeId): boolean {
    return mode === 'sound-and-vibrate' || mode === 'vibrate-only';
}

export function isReminderModeOff(mode: ReminderModeId): boolean {
    return mode === 'off';
}

/** Map persisted reminder mode + sound URI into NotificationService alert style. */
export function toReminderAlertStyle(mode: ReminderModeId, soundUrl: string): ReminderAlertStyle {
    if (isReminderModeOff(mode)) {
        return { enabled: false, vibration: false };
    }

    return {
        enabled: true,
        soundUrl: reminderModeUsesSound(mode) ? soundUrl || 'default' : undefined,
        vibration: reminderModeUsesVibration(mode),
        importance: mode === 'display-only' ? 'default' : 'high',
    };
}

import { describe, expect, it } from 'vitest';
import {
    DEFAULT_REMINDER_MODE,
    isReminderModeId,
    isReminderModeOff,
    reminderModeLabelKey,
    reminderModeUsesSound,
    reminderModeUsesVibration,
    toReminderAlertStyle,
    type ReminderModeId,
} from './reminderModes';

describe('reminderModes', () => {
    it('defaults to sound and vibrate', () => {
        expect(DEFAULT_REMINDER_MODE).toBe('sound-and-vibrate');
        expect(reminderModeLabelKey(DEFAULT_REMINDER_MODE)).toBe('settings.reminderModeSoundAndVibrate');
    });

    it('narrows valid reminder mode ids', () => {
        expect(isReminderModeId('sound-only')).toBe(true);
        expect(isReminderModeId('off')).toBe(true);
        expect(isReminderModeId('unknown')).toBe(false);
    });

    it('maps mode capabilities and alert styles', () => {
        expect(reminderModeUsesSound('sound-and-vibrate')).toBe(true);
        expect(reminderModeUsesVibration('sound-and-vibrate')).toBe(true);
        expect(reminderModeUsesSound('vibrate-only')).toBe(false);
        expect(reminderModeUsesVibration('sound-only')).toBe(false);
        expect(isReminderModeOff('off')).toBe(true);
        expect(isReminderModeOff('display-only')).toBe(false);
        expect(toReminderAlertStyle('off', 'default')).toEqual({ enabled: false, vibration: false });
        expect(toReminderAlertStyle('sound-only', 'content://x')).toEqual({
            enabled: true,
            soundUrl: 'content://x',
            vibration: false,
            importance: 'high',
        });
        expect(toReminderAlertStyle('sound-only', '')).toEqual({
            enabled: true,
            soundUrl: 'default',
            vibration: false,
            importance: 'high',
        });
        expect(toReminderAlertStyle('display-only', 'default')).toEqual({
            enabled: true,
            soundUrl: undefined,
            vibration: false,
            importance: 'default',
        });
        expect(reminderModeLabelKey('nope' as ReminderModeId)).toBe('settings.reminderModeSoundAndVibrate');
        expect(isReminderModeId(undefined)).toBe(false);
        expect(isReminderModeId(null)).toBe(false);
    });
});

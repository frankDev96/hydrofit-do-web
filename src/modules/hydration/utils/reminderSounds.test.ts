import { describe, expect, it } from 'vitest';
import {
    createDefaultReminderSound,
    DEFAULT_REMINDER_SOUND_ID,
    isReminderSoundSelection,
    toReminderSoundSelection,
} from './reminderSounds';

describe('reminderSounds', () => {
    it('creates a default device-sound selection', () => {
        const sound = createDefaultReminderSound('Default');
        expect(sound).toEqual({
            id: DEFAULT_REMINDER_SOUND_ID,
            title: 'Default',
            url: 'default',
        });
    });

    it('validates reminder sound selections', () => {
        expect(isReminderSoundSelection({ id: 'a', title: 'A', url: 'content://x' })).toBe(true);
        expect(isReminderSoundSelection({ id: 'a', title: 'A' })).toBe(false);
        expect(isReminderSoundSelection(null)).toBe(false);
    });

    it('maps device list items to selections', () => {
        expect(
            toReminderSoundSelection({
                id: 'content://media/30',
                title: 'Aldebaran',
                url: 'content://media/30',
            }),
        ).toEqual({
            id: 'content://media/30',
            title: 'Aldebaran',
            url: 'content://media/30',
        });
    });
});

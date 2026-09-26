export const DEFAULT_REMINDER_SOUND_ID = 'default';
export const DEFAULT_REMINDER_SOUND_URL = 'default';

export type ReminderSoundSelection = {
    id: string;
    title: string;
    url: string;
};

export type DeviceSoundListItem = {
    id: string;
    title: string;
    url: string;
};

export function createDefaultReminderSound(title: string): ReminderSoundSelection {
    return {
        id: DEFAULT_REMINDER_SOUND_ID,
        title,
        url: DEFAULT_REMINDER_SOUND_URL,
    };
}

export function isReminderSoundSelection(value: unknown): value is ReminderSoundSelection {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const candidate = value as Partial<ReminderSoundSelection>;
    return (
        typeof candidate.id === 'string' &&
        candidate.id.length > 0 &&
        typeof candidate.title === 'string' &&
        candidate.title.length > 0 &&
        typeof candidate.url === 'string' &&
        candidate.url.length > 0
    );
}

export function toReminderSoundSelection(sound: DeviceSoundListItem): ReminderSoundSelection {
    return {
        id: sound.id,
        title: sound.title,
        url: sound.url,
    };
}

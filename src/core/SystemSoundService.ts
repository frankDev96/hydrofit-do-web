export type DeviceNotificationSound = {
    id: string;
    title: string;
    url: string;
};

async function listNotificationSounds(): Promise<DeviceNotificationSound[]> {
    return [];
}

async function playSound(_url: string): Promise<void> {
    return undefined;
}

async function stopSound(): Promise<void> {
    return undefined;
}

const SystemSoundService = {
    listNotificationSounds,
    playSound,
    stopSound,
};

export default SystemSoundService;

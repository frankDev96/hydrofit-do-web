import { describe, expect, it } from 'vitest';
import SystemSoundService from './SystemSoundService';

describe('SystemSoundService', () => {
    it('has no device notification tones to list in the browser', async () => {
        await expect(SystemSoundService.listNotificationSounds()).resolves.toEqual([]);
        await SystemSoundService.playSound('content://media/1');
        await SystemSoundService.stopSound();
    });
});

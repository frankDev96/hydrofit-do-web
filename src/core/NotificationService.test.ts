import { describe, expect, it } from 'vitest';
import NotificationService from './NotificationService';

describe('NotificationService', () => {
    it('reports permission from the browser Notification API', async () => {
        const granted = await NotificationService.requestPermission();
        expect(typeof granted).toBe('boolean');
        expect(NotificationService.isPermissionGranted()).toBe(granted);
    });

    it('schedules and cancels reminders without a native module', async () => {
        await expect(NotificationService.scheduleHydrationReminders('07:00', '11:00', 2)).resolves.toBeUndefined();
        await expect(NotificationService.cancelAll()).resolves.toBeUndefined();
        await expect(NotificationService.consumeInitialNotificationPress()).resolves.toBeUndefined();
    });
});

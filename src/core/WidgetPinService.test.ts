import { describe, expect, it } from 'vitest';
import WidgetPinService from './WidgetPinService';

describe('WidgetPinService', () => {
    it('does not pin a home-screen widget in the browser', async () => {
        await expect(WidgetPinService.isPinSupported()).resolves.toBe(false);
        await expect(WidgetPinService.requestPin()).resolves.toBe(false);
        expect(WidgetPinService.peekPendingLogsSync()).toEqual([]);
        await expect(WidgetPinService.drainPendingLogs()).resolves.toEqual([]);
    });
});

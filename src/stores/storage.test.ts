import { beforeEach, describe, expect, it } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { mmkvStorage } from './storage';

describe('mmkvStorage', () => {
    beforeEach(() => {
        resetMmkv();
    });

    it('writes, reads, and removes string values', () => {
        mmkvStorage.setItem('theme', 'dark');
        expect(mmkvStorage.getItem('theme')).toBe('dark');

        mmkvStorage.removeItem('theme');
        expect(mmkvStorage.getItem('theme')).toBeNull();
    });
});

describe('createGatedMmkvStorage', () => {
    beforeEach(() => {
        resetMmkv();
    });

    it('drops writes until they are enabled', async () => {
        const { createGatedMmkvStorage } = await import('./storage');
        const gated = createGatedMmkvStorage();

        expect(gated.areWritesEnabled()).toBe(false);
        gated.setItem('gated', 'secret');
        expect(gated.getItem('gated')).toBeNull();

        gated.enableWrites();
        expect(gated.areWritesEnabled()).toBe(true);
        gated.setItem('gated', 'secret');
        expect(gated.getItem('gated')).toBe('secret');

        gated.removeItem('gated');
        expect(gated.getItem('gated')).toBeNull();
    });
});

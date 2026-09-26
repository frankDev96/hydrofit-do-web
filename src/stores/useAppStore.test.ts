import { beforeEach, describe, expect, it } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { mmkvStorage } from './storage';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
    beforeEach(() => {
        resetMmkv();
        useAppStore.getState().reset();
    });

    it('initializes with English language', () => {
        expect(useAppStore.getState().language).toBe('en');
    });

    it('persists display name and profile photo uri', () => {
        useAppStore.getState().setDisplayName('  Alex  ');
        useAppStore.getState().setProfilePhotoUri('file:///photo.jpg');

        expect(useAppStore.getState().displayName).toBe('Alex');
        expect(useAppStore.getState().profilePhotoUri).toBe('file:///photo.jpg');
    });

    it('defaults volume unit to ml and accepts fl_oz', () => {
        expect(useAppStore.getState().volumeUnit).toBe('ml');
        useAppStore.getState().setVolumeUnit('fl_oz');
        expect(useAppStore.getState().volumeUnit).toBe('fl_oz');
    });

    it('persists the hydration widget prompt flag', () => {
        expect(useAppStore.getState().hasHydrationWidget).toBe(false);
        useAppStore.getState().setHasHydrationWidget(true);
        expect(useAppStore.getState().hasHydrationWidget).toBe(true);
    });

    it('merges persisted app preferences', async () => {
        mmkvStorage.setItem(
            'hydrofit-app-storage',
            JSON.stringify({
                state: {
                    language: 'hi',
                    displayName: 'Alex',
                    profilePhotoUri: 'file:///photo.jpg',
                    volumeUnit: 'fl_oz',
                    hasHydrationWidget: true,
                },
                version: 0,
            }),
        );

        await useAppStore.persist.rehydrate();

        expect(useAppStore.getState().language).toBe('hi');
        expect(useAppStore.getState().displayName).toBe('Alex');
        expect(useAppStore.getState().profilePhotoUri).toBe('file:///photo.jpg');
        expect(useAppStore.getState().volumeUnit).toBe('fl_oz');
        expect(useAppStore.getState().hasHydrationWidget).toBe(true);
    });

    it('keeps current app state when persisted fields are the wrong type', async () => {
        useAppStore.getState().setDisplayName('Keep');
        useAppStore.getState().setVolumeUnit('ml');
        mmkvStorage.setItem(
            'hydrofit-app-storage',
            JSON.stringify({
                state: {
                    language: 'xx',
                    displayName: 12,
                    profilePhotoUri: false,
                    volumeUnit: 'cups',
                    hasHydrationWidget: 'yes',
                },
                version: 0,
            }),
        );

        await useAppStore.persist.rehydrate();

        expect(useAppStore.getState().displayName).toBe('Keep');
        expect(useAppStore.getState().volumeUnit).toBe('ml');
    });
});

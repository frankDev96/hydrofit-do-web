import { beforeEach, describe, expect, it } from 'vitest';
import { useAdBannerStore } from './useAdBannerStore';

describe('useAdBannerStore', () => {
    beforeEach(() => {
        useAdBannerStore.getState().reset();
    });

    it('starts with the persistent tab banner', () => {
        expect(useAdBannerStore.getState().chrome).toBe('tab');
    });

    it('replaces the tab banner with a dismissible override', () => {
        useAdBannerStore.getState().showDismissible();
        expect(useAdBannerStore.getState().chrome).toBe('dismissible');
        useAdBannerStore.getState().clearDismissible();
        expect(useAdBannerStore.getState().chrome).toBe('tab');
    });

    it('hides the tab banner while an overlay hosts its own banner', () => {
        useAdBannerStore.getState().hideForOverlay();
        expect(useAdBannerStore.getState().chrome).toBe('hidden');
        useAdBannerStore.getState().restoreFromOverlay();
        expect(useAdBannerStore.getState().chrome).toBe('tab');
    });

    it('does not revive a dismissible banner when clearing after an overlay hide', () => {
        useAdBannerStore.getState().showDismissible();
        useAdBannerStore.getState().hideForOverlay();
        useAdBannerStore.getState().clearDismissible();
        expect(useAdBannerStore.getState().chrome).toBe('hidden');
    });
});

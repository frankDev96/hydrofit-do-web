import type { StateStorage } from 'zustand/middleware';
import { deviceStore } from './deviceStore';

export { deviceStore };

export const mmkvStorage: StateStorage = {
    setItem: (name, value) => {
        deviceStore.set(name, value);
    },
    getItem: name => {
        const value = deviceStore.getString(name);
        return value ?? null;
    },
    removeItem: name => {
        deviceStore.delete(name);
    },
};

/**
 * Storage that drops writes until {@link GatedStateStorage.enableWrites}.
 * Prevents Zustand async rehydration races from persisting empty initial state over
 * previously saved intake / preference data.
 */
export type GatedStateStorage = StateStorage & {
    enableWrites: () => void;
    areWritesEnabled: () => boolean;
};

export function createGatedMmkvStorage(): GatedStateStorage {
    let writesEnabled = false;

    return {
        enableWrites: () => {
            writesEnabled = true;
        },
        areWritesEnabled: () => writesEnabled,
        setItem: (name, value) => {
            if (!writesEnabled) {
                return;
            }
            deviceStore.set(name, value);
        },
        getItem: name => {
            const value = deviceStore.getString(name);
            return value ?? null;
        },
        removeItem: name => {
            deviceStore.delete(name);
        },
    };
}

/** Wipe every key in the shared device store. */
export function clearAllMmkvStorage(): void {
    deviceStore.clearAll();
}

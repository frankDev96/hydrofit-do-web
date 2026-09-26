import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LanguageConfig, resolveLanguageCode, type LanguageCode } from '../i18n/config';
import { mmkvStorage } from './storage';

export type VolumeUnit = 'ml' | 'fl_oz';

export interface AppState {
    language: LanguageCode;
    displayName: string;
    profilePhotoUri: string | null;
    volumeUnit: VolumeUnit;
    hasHydrationWidget: boolean;
}

export interface AppStore extends AppState {
    setLanguage: (language: string) => void;
    setDisplayName: (name: string) => void;
    setProfilePhotoUri: (uri: string | null) => void;
    setVolumeUnit: (unit: VolumeUnit) => void;
    setHasHydrationWidget: (value: boolean) => void;
    reset: () => void;
}

const DEFAULT_LANGUAGE = LanguageConfig.defaultLanguage;

const INITIAL_STATE: AppState = {
    language: DEFAULT_LANGUAGE,
    displayName: '',
    profilePhotoUri: null,
    volumeUnit: 'ml',
    hasHydrationWidget: false,
};

function parseVolumeUnit(value: unknown): VolumeUnit {
    return value === 'fl_oz' ? 'fl_oz' : 'ml';
}

export const useAppStore = create<AppStore>()(
    persist(
        set => ({
            ...INITIAL_STATE,

            setLanguage: (language: string) => set({ language: resolveLanguageCode(language) }),

            setDisplayName: (name: string) => set({ displayName: name.trim() }),

            setProfilePhotoUri: (uri: string | null) => set({ profilePhotoUri: uri }),

            setVolumeUnit: (volumeUnit: VolumeUnit) => set({ volumeUnit }),

            setHasHydrationWidget: (hasHydrationWidget: boolean) => set({ hasHydrationWidget }),

            reset: () => set({ ...INITIAL_STATE }),
        }),
        {
            name: 'hydrofit-app-storage',
            storage: createJSONStorage(() => mmkvStorage),
            partialize: state => ({
                language: state.language,
                displayName: state.displayName,
                profilePhotoUri: state.profilePhotoUri,
                volumeUnit: state.volumeUnit,
                hasHydrationWidget: state.hasHydrationWidget,
            }),
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<AppState> | undefined;
                return {
                    ...currentState,
                    language: resolveLanguageCode(persisted?.language ?? currentState.language),
                    displayName:
                        typeof persisted?.displayName === 'string' ? persisted.displayName : currentState.displayName,
                    profilePhotoUri:
                        typeof persisted?.profilePhotoUri === 'string'
                            ? persisted.profilePhotoUri
                            : currentState.profilePhotoUri,
                    volumeUnit: parseVolumeUnit(persisted?.volumeUnit ?? currentState.volumeUnit),
                    hasHydrationWidget:
                        typeof persisted?.hasHydrationWidget === 'boolean'
                            ? persisted.hasHydrationWidget
                            : currentState.hasHydrationWidget,
                };
            },
        },
    ),
);

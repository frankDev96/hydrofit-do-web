import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { deviceStore, mmkvStorage } from './storage';

export type WeightUnit = 'kg' | 'lbs';

/** Half-day marker shown on the time pickers. */
export type DayPeriod = 'AM' | 'PM';

/**
 * OnboardingState — persisted to MMKV on completion (FR10)
 */
export type OnboardingState = {
    gender: 'male' | 'female' | 'other' | null;
    weightKg: number;
    weightUnit: WeightUnit;
    wakeTime: string; // 'HH:MM'
    wakeTimePeriod: DayPeriod;
    bedTime: string; // 'HH:MM'
    dailyTargetMl: number;
    isOnboardingCompleted: boolean;
    /** Epoch ms when onboarding first completed — used for time-gated tips. */
    onboardingCompletedAtMs: number | null;
};

export type OnboardingStore = OnboardingState & {
    setGender: (gender: 'male' | 'female' | 'other') => void;
    setWeightKg: (kg: number) => void;
    setWeightUnit: (unit: WeightUnit) => void;
    setWakeTime: (time: string) => void;
    setBedTime: (time: string) => void;
    complete: () => void;
    reset: () => void;
};

const storage = deviceStore;

const KEYS = {
    gender: 'onboarding_gender',
    weightKg: 'onboarding_weightKg',
    weightUnit: 'onboarding_weightUnit',
    wakeTime: 'onboarding_wakeTime',
    wakeTimePeriod: 'onboarding_wakeTimePeriod',
    bedTime: 'onboarding_bedTime',
    dailyTargetMl: 'onboarding_dailyTargetMl',
    isCompleted: 'isOnboardingCompleted',
    completedAtMs: 'onboarding_completedAtMs',
} as const;

function parseWeightUnit(value: string | undefined): WeightUnit {
    return value === 'lbs' ? 'lbs' : 'kg';
}

/** AM/PM is a view of the 24h wake time, so it is always derived rather than set on its own. */
export function toDayPeriod(time: string): DayPeriod {
    return Number(time.split(':')[0]) < 12 ? 'AM' : 'PM';
}

/**
 * Hydration target formula: weightKg × 33, rounded to nearest 10ml (FR9)
 */
function calculateDailyTarget(weightKg: number): number {
    return Math.round((weightKg * 33) / 10) * 10;
}

function loadFromMMKV(): Partial<OnboardingState> {
    const wakeTime = storage.getString(KEYS.wakeTime) ?? '07:00';

    return {
        gender: (storage.getString(KEYS.gender) as 'male' | 'female' | undefined) ?? null,
        weightKg: storage.getNumber(KEYS.weightKg) ?? 70,
        weightUnit: parseWeightUnit(storage.getString(KEYS.weightUnit)),
        wakeTime,
        wakeTimePeriod: toDayPeriod(wakeTime),
        bedTime: storage.getString(KEYS.bedTime) ?? '22:00',
        dailyTargetMl: storage.getNumber(KEYS.dailyTargetMl) ?? 2310,
        isOnboardingCompleted: storage.getBoolean(KEYS.isCompleted) ?? false,
        onboardingCompletedAtMs: storage.getNumber(KEYS.completedAtMs) ?? null,
    };
}

export const useOnboardingStore = create<OnboardingStore>()(
    persist(
        set => ({
            gender: null,
            weightKg: 70,
            weightUnit: 'kg',
            wakeTime: '07:00',
            wakeTimePeriod: 'AM',
            bedTime: '22:00',
            dailyTargetMl: calculateDailyTarget(70),
            isOnboardingCompleted: false,
            onboardingCompletedAtMs: null,

            // Hydrate from MMKV on first access
            ...loadFromMMKV(),

            setGender: gender => set({ gender }),

            setWeightKg: weightKg => set({ weightKg, dailyTargetMl: calculateDailyTarget(weightKg) }),
            setWeightUnit: weightUnit => set({ weightUnit }),

            setWakeTime: wakeTime => set({ wakeTime, wakeTimePeriod: toDayPeriod(wakeTime) }),
            setBedTime: bedTime => set({ bedTime }),

            complete: () => {
                set(state => {
                    const dailyTargetMl = calculateDailyTarget(state.weightKg);
                    const onboardingCompletedAtMs = state.onboardingCompletedAtMs ?? Date.now();
                    // Persist all fields to MMKV (FR10)
                    if (state.gender) storage.set(KEYS.gender, state.gender);
                    storage.set(KEYS.weightKg, state.weightKg);
                    storage.set(KEYS.weightUnit, state.weightUnit);
                    storage.set(KEYS.wakeTime, state.wakeTime);
                    storage.set(KEYS.wakeTimePeriod, state.wakeTimePeriod);
                    storage.set(KEYS.bedTime, state.bedTime);
                    storage.set(KEYS.dailyTargetMl, dailyTargetMl);
                    storage.set(KEYS.isCompleted, true);
                    storage.set(KEYS.completedAtMs, onboardingCompletedAtMs);
                    return {
                        dailyTargetMl,
                        isOnboardingCompleted: true,
                        onboardingCompletedAtMs,
                    };
                });
            },

            reset: () => {
                Object.values(KEYS).forEach(k => storage.delete(k));
                set({
                    gender: null,
                    weightKg: 70,
                    weightUnit: 'kg',
                    wakeTime: '07:00',
                    wakeTimePeriod: 'AM',
                    bedTime: '22:00',
                    dailyTargetMl: calculateDailyTarget(70),
                    isOnboardingCompleted: false,
                    onboardingCompletedAtMs: null,
                });
            },
        }),
        {
            name: 'hydrofit-onboarding-storage',
            storage: createJSONStorage(() => mmkvStorage),
        },
    ),
);

import { vi } from 'vitest';
import type { DayPeriod, WeightUnit } from '@stores';

export function createMockNavigation() {
    return {
        navigate: vi.fn(),
        goBack: vi.fn(),
        replace: vi.fn(),
        push: vi.fn(),
    };
}

export type MockOnboardingStore = {
    gender: 'male' | 'female' | 'other' | null;
    weightKg: number;
    weightUnit: WeightUnit;
    wakeTime: string;
    wakeTimePeriod: DayPeriod;
    bedTime: string;
    dailyTargetMl: number;
    isOnboardingCompleted: boolean;
    setGender: ReturnType<typeof vi.fn>;
    setWeightKg: ReturnType<typeof vi.fn>;
    setWeightUnit: ReturnType<typeof vi.fn>;
    setWakeTime: ReturnType<typeof vi.fn>;
    setBedTime: ReturnType<typeof vi.fn>;
    complete: ReturnType<typeof vi.fn>;
    reset: ReturnType<typeof vi.fn>;
};

export function createMockOnboardingStore(overrides: Partial<MockOnboardingStore> = {}): MockOnboardingStore {
    return {
        gender: null,
        weightKg: 70,
        weightUnit: 'kg',
        wakeTime: '07:00',
        wakeTimePeriod: 'AM',
        bedTime: '22:00',
        dailyTargetMl: 2310,
        isOnboardingCompleted: false,
        setGender: vi.fn(),
        setWeightKg: vi.fn(),
        setWeightUnit: vi.fn(),
        setWakeTime: vi.fn(),
        setBedTime: vi.fn(),
        complete: vi.fn(),
        reset: vi.fn(),
        ...overrides,
    };
}

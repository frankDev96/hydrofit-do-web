import { beforeEach, describe, expect, it } from 'vitest';
import { resetMmkv } from '../../vitest/mocks/mmkv';
import { useOnboardingStore } from './useOnboardingStore';

describe('useOnboardingStore', () => {
    beforeEach(() => {
        resetMmkv();
        useOnboardingStore.getState().reset();
    });

    it('stores gender and wake/bed times', () => {
        useOnboardingStore.getState().setGender('female');
        useOnboardingStore.getState().setWakeTime('06:30');
        useOnboardingStore.getState().setBedTime('22:30');

        const state = useOnboardingStore.getState();
        expect(state.gender).toBe('female');
        expect(state.wakeTime).toBe('06:30');
        expect(state.bedTime).toBe('22:30');
    });

    it('derives the AM/PM period from the wake time', () => {
        expect(useOnboardingStore.getState().wakeTimePeriod).toBe('AM');

        useOnboardingStore.getState().setWakeTime('19:30');
        expect(useOnboardingStore.getState().wakeTimePeriod).toBe('PM');

        useOnboardingStore.getState().setWakeTime('00:15');
        expect(useOnboardingStore.getState().wakeTimePeriod).toBe('AM');
    });

    it('stores selected weight unit and defaults to kg', () => {
        expect(useOnboardingStore.getState().weightUnit).toBe('kg');

        useOnboardingStore.getState().setWeightUnit('lbs');
        expect(useOnboardingStore.getState().weightUnit).toBe('lbs');

        useOnboardingStore.getState().reset();
        expect(useOnboardingStore.getState().weightUnit).toBe('kg');
    });

    it('recalculates the daily target from weight', () => {
        useOnboardingStore.getState().setWeightKg(70);
        expect(useOnboardingStore.getState().dailyTargetMl).toBe(2310);
    });

    it('marks onboarding complete and can reset', () => {
        useOnboardingStore.getState().setGender('male');
        useOnboardingStore.getState().complete();
        expect(useOnboardingStore.getState().isOnboardingCompleted).toBe(true);

        useOnboardingStore.getState().reset();
        expect(useOnboardingStore.getState().isOnboardingCompleted).toBe(false);
        expect(useOnboardingStore.getState().gender).toBeNull();
    });

    it('completes without a gender and keeps the first completion timestamp', () => {
        useOnboardingStore.getState().complete();
        expect(useOnboardingStore.getState().isOnboardingCompleted).toBe(true);
        expect(useOnboardingStore.getState().onboardingCompletedAtMs).toEqual(expect.any(Number));

        const firstCompletedAt = useOnboardingStore.getState().onboardingCompletedAtMs;
        useOnboardingStore.getState().complete();
        expect(useOnboardingStore.getState().onboardingCompletedAtMs).toBe(firstCompletedAt);
    });
});

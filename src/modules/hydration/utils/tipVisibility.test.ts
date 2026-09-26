import { describe, expect, it } from 'vitest';
import type { TipDefinition } from '@modules/hydration/constants/hydrationTipsCatalog';
import { pickTipOfTheDay, resolveTipVisibility } from './tipVisibility';

const DAY_MS = 24 * 60 * 60 * 1000;

const catalog: TipDefinition[] = [
    {
        id: 'always-a',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningFlushTitle',
        tagKey: 'tips.morningFlushTag',
        descriptionKey: 'tips.morningFlushDescription',
        visibility: { mode: 'always' },
        notifyOnReveal: false,
    },
    {
        id: 'days-gated',
        category: 'Morning',
        iconType: 'morning',
        titleKey: 'tips.morningUrineTitle',
        tagKey: 'tips.morningUrineTag',
        descriptionKey: 'tips.morningUrineDescription',
        visibility: { mode: 'afterDays', days: 2 },
        notifyOnReveal: true,
    },
    {
        id: 'achieve-gated',
        category: 'Nutrition',
        iconType: 'nutrition',
        titleKey: 'tips.soupSmoothieTitle',
        tagKey: 'tips.soupSmoothieTag',
        descriptionKey: 'tips.soupSmoothieDescription',
        visibility: { mode: 'afterAchievement', achievementId: 'first-drop' },
        notifyOnReveal: true,
    },
    {
        id: 'urge-tip',
        category: 'Habits',
        iconType: 'habit',
        titleKey: 'tips.benefitReminderTitle',
        tagKey: 'tips.benefitReminderTag',
        descriptionKey: 'tips.benefitReminderDescription',
        visibility: { mode: 'recurringUrge', intervalDays: 2 },
        notifyOnReveal: false,
    },
];

describe('resolveTipVisibility', () => {
    const nowMs = Date.parse('2026-09-08T12:00:00');

    it('shows always and urge tips; hides gated tips until unlocked', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {},
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs,
            revealedTipIds: [],
            lastUrgeEmittedByTipId: {},
            nowMs,
        });

        expect(result.visibleTips.map(tip => tip.id)).toEqual(['always-a', 'urge-tip']);
        expect(result.newlyRevealedTips).toEqual([]);
        expect(result.dueUrgeTips.map(tip => tip.id)).toEqual(['urge-tip']);
    });

    it('unlocks afterDays tips and marks them newly revealed once', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {},
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs - 2 * DAY_MS,
            revealedTipIds: [],
            lastUrgeEmittedByTipId: { 'urge-tip': '2026-09-08' },
            nowMs,
        });

        expect(result.visibleTips.map(tip => tip.id)).toContain('days-gated');
        expect(result.newlyRevealedTips.map(tip => tip.id)).toEqual(['days-gated']);
    });

    it('does not re-notify already revealed gated tips', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {},
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs - 2 * DAY_MS,
            revealedTipIds: ['days-gated'],
            lastUrgeEmittedByTipId: { 'urge-tip': '2026-09-08' },
            nowMs,
        });

        expect(result.newlyRevealedTips).toEqual([]);
    });

    it('unlocks afterAchievement tips when achievement is earned', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {
                '2026-09-08': [{ amountMl: 250, loggedAtMs: nowMs }],
            },
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs,
            revealedTipIds: [],
            lastUrgeEmittedByTipId: { 'urge-tip': '2026-09-08' },
            nowMs,
        });

        expect(result.visibleTips.map(tip => tip.id)).toContain('achieve-gated');
        expect(result.newlyRevealedTips.map(tip => tip.id)).toEqual(['achieve-gated']);
    });

    it('marks urge due after interval days have elapsed', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {},
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs,
            revealedTipIds: [],
            lastUrgeEmittedByTipId: { 'urge-tip': '2026-09-06' },
            nowMs,
        });

        expect(result.dueUrgeTips.map(tip => tip.id)).toEqual(['urge-tip']);
    });

    it('does not mark urge due when last emit was today', () => {
        const result = resolveTipVisibility({
            catalog,
            intakeByDate: {},
            dailyTargetMl: 2000,
            onboardingCompletedAtMs: nowMs,
            revealedTipIds: [],
            lastUrgeEmittedByTipId: { 'urge-tip': '2026-09-08' },
            nowMs,
        });

        expect(result.dueUrgeTips).toEqual([]);
    });
});

describe('pickTipOfTheDay', () => {
    it('picks stably from always and urge tips for a date key', () => {
        const visible = catalog.filter(
            tip => tip.visibility.mode === 'always' || tip.visibility.mode === 'recurringUrge',
        );
        const a = pickTipOfTheDay(visible, '2026-09-08');
        const b = pickTipOfTheDay(visible, '2026-09-08');
        expect(a?.id).toBe(b?.id);
        expect(a).not.toBeNull();
    });

    it('returns null when pool is empty', () => {
        expect(pickTipOfTheDay([], '2026-09-08')).toBeNull();
    });
});

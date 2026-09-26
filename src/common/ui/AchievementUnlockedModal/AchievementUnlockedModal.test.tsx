import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { CelebrationLayout } from '@theme';
import { AchievementUnlockedModal } from './AchievementUnlockedModal';

describe('AchievementUnlockedModal', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('celebrates the unlocked achievement with confetti, hero title, and a CTA', () => {
        const onClose = vi.fn();
        const { getByText, root } = render(
            <AchievementUnlockedModal
                visible
                badgeId="first-drop"
                title="First Drop"
                description="Logged your first glass of water."
                onClose={onClose}
            />,
        );

        expect(getByText('Achievement unlocked')).toBeTruthy();
        expect(getByText('First Drop')).toBeTruthy();
        expect(getByText('Logged your first glass of water.')).toBeTruthy();
        expect(getByText('Awesome')).toBeTruthy();
        expect(root.findAll(node => node.props['data-testid'] === 'achievement-badge')).toHaveLength(1);
        expect(root.findAll(node => node.props['data-testid'] === 'confetti-piece')).toHaveLength(
            CelebrationLayout.pieceCount,
        );
    });

    it('hides content when not visible', () => {
        const { queryByText, root } = render(
            <AchievementUnlockedModal
                visible={false}
                badgeId="first-drop"
                title="First Drop"
                description="Hidden"
                onClose={vi.fn()}
            />,
        );

        expect(queryByText('Achievement unlocked')).toBeNull();
        expect(root.findAll(node => node.props['data-testid'] === 'confetti-piece')).toHaveLength(0);
    });

    it('closes when the CTA is pressed', () => {
        const onClose = vi.fn();
        const { getPressableByLabel } = render(
            <AchievementUnlockedModal
                visible
                badgeId="centurion"
                title="Centurion"
                description="Logged 100 glasses of water."
                onClose={onClose}
            />,
        );

        fireEvent.press(getPressableByLabel('Awesome'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('closes when anywhere on the screen is pressed', () => {
        const onClose = vi.fn();
        const { getByLabelText } = render(
            <AchievementUnlockedModal
                visible
                badgeId="centurion"
                title="Centurion"
                description="Logged 100 glasses of water."
                onClose={onClose}
            />,
        );

        fireEvent.press(getByLabelText('Close backdrop'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('auto-dismisses after the readable duration', () => {
        const onClose = vi.fn();
        render(
            <AchievementUnlockedModal
                visible
                badgeId="first-drop"
                title="First Drop"
                description="Logged your first glass of water."
                onClose={onClose}
            />,
        );

        expect(onClose).not.toHaveBeenCalled();
        vi.advanceTimersByTime(CelebrationLayout.autoDismissMs - 1);
        expect(onClose).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

import React from 'react';
import { fireEvent, render } from '@/test-utils/render';
import { describe, expect, it, vi } from 'vitest';
import CommonHeader from './CommonHeader';

describe('CommonHeader', () => {
    it('renders default HydroFit.do title without avatar or skip', () => {
        const { getByText, queryByText } = render(<CommonHeader />);
        expect(getByText('HydroFit.do')).toBeTruthy();
        expect(queryByText('Skip')).toBeNull();
    });

    it('renders avatar and triggers onAvatarPress when provided', () => {
        const onAvatarPress = vi.fn();
        const { getPressableByLabel } = render(
            <CommonHeader avatarSource={1 as unknown as number} onAvatarPress={onAvatarPress} />,
        );
        fireEvent.press(getPressableByLabel('User profile'));
        expect(onAvatarPress).toHaveBeenCalledTimes(1);
    });

    it('renders skip action and calls onSkip', () => {
        const onSkip = vi.fn();
        const { getPressableByText } = render(<CommonHeader onSkip={onSkip} />);
        fireEvent.press(getPressableByText('Skip'));
        expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it('renders custom right action over onSkip', () => {
        const { getByText, queryByText } = render(<CommonHeader onSkip={vi.fn()} rightAction={<span>Action</span>} />);
        expect(getByText('Action')).toBeTruthy();
        expect(queryByText('Skip')).toBeNull();
    });

    it('renders back button when onBack is provided and calls onBack', () => {
        const onBack = vi.fn();
        const { getPressableByLabel } = render(<CommonHeader onBack={onBack} title="Select container" />);
        fireEvent.press(getPressableByLabel('Go back'));
        expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('renders custom left action when provided', () => {
        const { getByText } = render(<CommonHeader leftAction={<span>Custom Left</span>} />);
        expect(getByText('Custom Left')).toBeTruthy();
    });

    it('renders initials when no photo source is provided', () => {
        const { getByLabelText } = render(<CommonHeader avatarInitials="U" />);
        expect(getByLabelText('U')).toBeTruthy();
    });

    it('renders gender fallback art when only avatarFallback is provided', () => {
        const { getByText, root } = render(<CommonHeader avatarFallback={{ uri: '/fallback.png' }} />);
        expect(getByText('HydroFit.do')).toBeTruthy();
        expect(root.findAll(node => node.props.src === '/fallback.png').length).toBeGreaterThan(0);
    });
});

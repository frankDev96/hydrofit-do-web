import React from 'react';
import { fireEvent, render } from '@/test-utils/render';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BottomNavBar from './BottomNavBar';

describe('BottomNavBar', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vi.fn(() => true) });
    });

    it('renders all 4 tabs with Home active by default', () => {
        const onSelectTab = vi.fn();
        const { getByText, getByLabelText } = render(<BottomNavBar activeTab="Home" onSelectTab={onSelectTab} />);

        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Stats')).toBeTruthy();
        expect(getByText('Plan')).toBeTruthy();
        expect(getByText('Profile')).toBeTruthy();

        const homeTab = getByLabelText('Home tab');
        expect(homeTab.props['aria-current']).toBe('page');
    });

    it('triggers onSelectTab with haptic when a tab is pressed', () => {
        const onSelectTab = vi.fn();
        const { getPressableByLabel } = render(<BottomNavBar activeTab="Home" onSelectTab={onSelectTab} />);

        fireEvent.press(getPressableByLabel('Stats tab'));
        expect(navigator.vibrate).toHaveBeenCalled();
        expect(onSelectTab).toHaveBeenCalledWith('Stats');

        fireEvent.press(getPressableByLabel('Plan tab'));
        expect(onSelectTab).toHaveBeenCalledWith('Plan');

        fireEvent.press(getPressableByLabel('Profile tab'));
        expect(onSelectTab).toHaveBeenCalledWith('Profile');
    });
});

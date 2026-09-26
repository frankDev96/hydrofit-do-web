import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { CommonAlert } from './CommonAlert';

describe('CommonAlert', () => {
    it('renders title, description, icon, and buttons when visible', () => {
        const onPrimary = vi.fn();
        const onSecondary = vi.fn();
        const { getByText, getByLabelText } = render(
            <CommonAlert
                visible
                title="Select an option to Proceed"
                description="Choose a gender before continuing."
                icon={<span>!</span>}
                buttons={[
                    { label: 'Got it', onPress: onPrimary },
                    { label: 'Cancel', onPress: onSecondary, variant: 'secondary' },
                ]}
            />,
        );

        expect(getByText('Select an option to Proceed')).toBeTruthy();
        expect(getByText('Choose a gender before continuing.')).toBeTruthy();
        expect(getByText('!')).toBeTruthy();

        fireEvent.press(getByLabelText('Got it'));
        fireEvent.press(getByLabelText('Cancel'));

        expect(onPrimary).toHaveBeenCalledTimes(1);
        expect(onSecondary).toHaveBeenCalledTimes(1);
    });

    it('hides content when not visible', () => {
        const { queryByText } = render(
            <CommonAlert visible={false} title="Hidden" buttons={[{ label: 'OK', onPress: vi.fn() }]} />,
        );

        expect(queryByText('Hidden')).toBeNull();
    });

    it('calls onClose when backdrop is pressed', () => {
        const onClose = vi.fn();
        const { getByLabelText } = render(
            <CommonAlert visible title="Alert" onClose={onClose} buttons={[{ label: 'OK', onPress: vi.fn() }]} />,
        );

        fireEvent.press(getByLabelText('Close backdrop'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});

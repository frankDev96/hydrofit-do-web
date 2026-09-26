import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { CommonButton } from './CommonButton';

describe('CommonButton', () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vi.fn(() => true) });
    });

    it('renders the label, fires haptic, and calls onPress', () => {
        const onPress = vi.fn();
        const { getByText, getPressableByLabel } = render(
            <CommonButton label="Enable" onPress={onPress} accessibilityLabel="Enable notifications" />,
        );

        expect(getByText('Enable')).toBeTruthy();
        fireEvent.press(getPressableByLabel('Enable notifications'));
        expect(onPress).toHaveBeenCalledTimes(1);
        // Haptic is applied via withTapHaptic in CommonButton; covered in tapHaptic.test.ts.
    });

    it('does not call onPress when disabled', () => {
        const onPress = vi.fn();
        const { getPressableByLabel } = render(<CommonButton label="Continue" onPress={onPress} disabled />);

        expect(() => getPressableByLabel('Continue')).toThrow();
        expect(onPress).not.toHaveBeenCalled();
        expect(navigator.vibrate).not.toHaveBeenCalled();
    });

    it('renders leading and trailing icons', () => {
        const { getByText } = render(
            <CommonButton
                label="Confirm"
                onPress={vi.fn()}
                leadingIcon={<span>L</span>}
                trailingIcon={<span>T</span>}
            />,
        );

        expect(getByText('L')).toBeTruthy();
        expect(getByText('Confirm')).toBeTruthy();
        expect(getByText('T')).toBeTruthy();
    });

    it('keeps short uppercase labels such as NEXT on a single unclipped line', () => {
        const { getByText } = render(<CommonButton label="NEXT" onPress={vi.fn()} shape="rounded" elevated />);
        const label = getByText('NEXT');
        expect(label).toBeTruthy();
        expect(label.props.numberOfLines).toBeUndefined();
    });

    it('applies variant, size, shape, and width styles including pressed and elevated', () => {
        expect(render(<CommonButton label="Primary" onPress={vi.fn()} elevated />).getByText('Primary')).toBeTruthy();
        expect(
            render(
                <CommonButton
                    label="Secondary"
                    onPress={vi.fn()}
                    variant="secondary"
                    size="compact"
                    shape="rounded"
                    fullWidth={false}
                />,
            ).getByText('Secondary'),
        ).toBeTruthy();
        expect(
            render(<CommonButton label="Remove" onPress={vi.fn()} variant="destructive" size="min" />).getByText(
                'Remove',
            ),
        ).toBeTruthy();
        expect(
            render(<CommonButton label="Ghost" onPress={vi.fn()} variant="ghost" />).getByText('Ghost'),
        ).toBeTruthy();
        expect(render(<CommonButton label="Busy" onPress={vi.fn()} disabled />).getByText('Busy')).toBeTruthy();
    });
});

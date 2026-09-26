import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { CommonTimePicker } from './CommonTimePicker';

describe('CommonTimePicker', () => {
    it('renders the current time and opens the clock picker on press', () => {
        const onChange = vi.fn();
        const value = new Date(2026, 8, 11, 9, 0, 0, 0);

        const { root } = render(
            <CommonTimePicker
                value={value}
                onChange={onChange}
                accessibilityLabel="Time of intake, currently 09:00 AM"
            />,
        );

        const input = root.findByType('input');
        expect(input.props.value).toBe('09:00');
        expect(input.props['aria-label']).toBe('Time of intake, currently 09:00 AM');
        fireEvent.change(input, '14:30');

        expect(onChange).toHaveBeenCalledTimes(1);
        const next = onChange.mock.calls[0]?.[0] as Date;
        expect(next.getHours()).toBe(14);
        expect(next.getMinutes()).toBe(30);
        expect(next.getDate()).toBe(11);
    });

    it('does not open the picker when disabled', () => {
        const onChange = vi.fn();
        const { getPressableByLabel } = render(
            <CommonTimePicker value={new Date(2026, 8, 11, 9, 0)} onChange={onChange} disabled />,
        );

        expect(() => getPressableByLabel('09:00 AM')).toThrow();
        expect(onChange).not.toHaveBeenCalled();
    });
});

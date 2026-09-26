import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { LogIntakeModal } from './LogIntakeModal';

describe('LogIntakeModal', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders correctly when visible', () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();

        const { getByText, getByLabelText } = render(
            <LogIntakeModal visible={true} initialAmount={250} onClose={onClose} onConfirm={onConfirm} />,
        );

        expect(getByText('Log Intake')).toBeTruthy();
        expect(getByText('TIME OF INTAKE')).toBeTruthy();
        expect(getByText('AMOUNT')).toBeTruthy();
        expect(getByText('QUICK PRESETS')).toBeTruthy();
        expect(getByText('250')).toBeTruthy();
        expect(getByLabelText('Close modal')).toBeTruthy();
    });

    it('does not render content when visible is false', () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();

        const { queryByText } = render(
            <LogIntakeModal visible={false} initialAmount={250} onClose={onClose} onConfirm={onConfirm} />,
        );

        expect(queryByText('Log Intake')).toBeNull();
    });

    it('calls onClose when close button or backdrop is clicked', () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();

        const { getByLabelText } = render(<LogIntakeModal visible={true} onClose={onClose} onConfirm={onConfirm} />);

        fireEvent.press(getByLabelText('Close modal'));
        expect(onClose).toHaveBeenCalledTimes(1);

        fireEvent.press(getByLabelText('Close backdrop'));
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('allows changing preset amount and calls onConfirm with chosen amount', () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();

        const { getByLabelText, getByText, getPressableByLabel } = render(
            <LogIntakeModal visible={true} initialAmount={150} onClose={onClose} onConfirm={onConfirm} />,
        );

        expect(getByText('150')).toBeTruthy();

        // Select 500ml preset
        fireEvent.press(getByLabelText('500ml preset'));
        expect(getByText('500')).toBeTruthy();

        // Confirm
        fireEvent.press(getPressableByLabel('Log Intake'));
        expect(onConfirm).toHaveBeenCalledWith(500, expect.any(Number));
    });

    it('lets the user pick a past clock time and confirms amount with that timestamp', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 11, 16, 0, 0, 0));
        const onClose = vi.fn();
        const onConfirm = vi.fn();
        const initialTime = new Date(2026, 8, 11, 9, 0, 0, 0);

        const { getByLabelText, queryByText, getPressableByLabel, root } = render(
            <LogIntakeModal
                visible={true}
                initialAmount={250}
                initialTime={initialTime}
                onClose={onClose}
                onConfirm={onConfirm}
            />,
        );

        const timeInput = root.findByType('input');
        expect(timeInput.props.value).toBe('09:00');
        fireEvent.change(timeInput, '14:30');
        expect(root.findByType('input').props.value).toBe('14:30');
        expect(queryByText('Choose a past time')).toBeNull();

        fireEvent.press(getByLabelText('500ml preset'));
        fireEvent.press(getPressableByLabel('Log Intake'));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        const [amountMl, loggedAtMs] = onConfirm.mock.calls[0] as [number, number];
        expect(amountMl).toBe(500);
        const logged = new Date(loggedAtMs);
        expect(logged.getHours()).toBe(14);
        expect(logged.getMinutes()).toBe(30);
        expect(logged.getDate()).toBe(11);
    });

    it('keeps the previous time and shows an alert when a future clock time is picked', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 8, 11, 10, 0, 0, 0));
        const onClose = vi.fn();
        const onConfirm = vi.fn();
        const initialTime = new Date(2026, 8, 11, 9, 0, 0, 0);

        const { getByLabelText, getByText, getPressableByLabel, root } = render(
            <LogIntakeModal
                visible={true}
                initialAmount={250}
                initialTime={initialTime}
                onClose={onClose}
                onConfirm={onConfirm}
            />,
        );

        fireEvent.change(root.findByType('input'), '14:30');
        expect(root.findByType('input').props.value).toBe('09:00');
        expect(getByText('Choose a past time')).toBeTruthy();
        expect(
            getByText('You can only log intake for a time earlier than now. Current and future times are not allowed.'),
        ).toBeTruthy();

        fireEvent.press(getByLabelText('Got it'));
        fireEvent.press(getPressableByLabel('Log Intake'));

        const [, loggedAtMs] = onConfirm.mock.calls[0] as [number, number];
        const logged = new Date(loggedAtMs);
        expect(logged.getHours()).toBe(9);
        expect(logged.getMinutes()).toBe(0);
    });

    it('supports custom title and custom presets', () => {
        const onClose = vi.fn();
        const onConfirm = vi.fn();

        const { getByText, getByLabelText } = render(
            <LogIntakeModal
                visible={true}
                title="Add Water"
                presets={[100, 200, 300]}
                initialAmount={100}
                onClose={onClose}
                onConfirm={onConfirm}
            />,
        );

        expect(getByText('Add Water')).toBeTruthy();
        expect(getByLabelText('200ml preset')).toBeTruthy();
    });
});

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { DrumPicker } from './DrumPicker';

describe('DrumPicker', () => {
    it('renders a short list without forcing virtualization', () => {
        const { getByText } = render(
            <DrumPicker items={['68', '69', '70']} selectedIndex={1} onChange={vi.fn()} virtualized={false} />,
        );

        expect(getByText('69')).toBeTruthy();
    });

    it('auto-virtualizes lists at the windowing threshold', () => {
        const items = Array.from({ length: 50 }, (_, index) => String(index));
        const { getByText } = render(<DrumPicker items={items} selectedIndex={0} onChange={vi.fn()} />);

        expect(getByText('0')).toBeTruthy();
    });

    it('honors an explicit virtualized flag on a short list', () => {
        const { getByText } = render(
            <DrumPicker items={['a', 'b']} selectedIndex={0} onChange={vi.fn()} virtualized />,
        );

        expect(getByText('a')).toBeTruthy();
    });
});

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { NumericDrumPicker } from './NumericDrumPicker';

const VALUES = [68, 69, 70, 71, 72];

describe('NumericDrumPicker', () => {
    it('renders the selected value', () => {
        const { getByText } = render(<NumericDrumPicker values={VALUES} selected={70} onSelect={vi.fn()} />);
        expect(getByText('70')).toBeTruthy();
    });

    it('selects the first value when the current selection is missing', () => {
        const onSelect = vi.fn();
        render(<NumericDrumPicker values={VALUES} selected={99} onSelect={onSelect} />);
        expect(onSelect).toHaveBeenCalledWith(68);
    });
});

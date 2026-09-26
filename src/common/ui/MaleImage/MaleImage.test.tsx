import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import { MaleImage } from './MaleImage';
import { Colors } from '@theme';

describe('MaleImage', () => {
    it('renders with default size and primary color', () => {
        const { root } = render(<MaleImage />);
        const svg = root.find(node => node.props.viewBox === '0 0 160 160');
        expect(svg.props.width).toBe(56);
        expect(svg.props.height).toBe(56);
    });

    it('accepts custom size and color', () => {
        const { root } = render(<MaleImage width={80} height={80} color={Colors.accentOrange} />);
        const svg = root.find(node => node.props.viewBox === '0 0 160 160');
        expect(svg.props.width).toBe(80);
        expect(svg.props.height).toBe(80);
    });
});

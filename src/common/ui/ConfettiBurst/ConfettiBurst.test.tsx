import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import { CelebrationLayout } from '@theme';
import { ConfettiBurst } from './ConfettiBurst';

describe('ConfettiBurst', () => {
    it('renders a burst of pieces when active', () => {
        const { root } = render(<ConfettiBurst active />);
        expect(root.findAll(node => node.props['data-testid'] === 'confetti-piece')).toHaveLength(
            CelebrationLayout.pieceCount,
        );
    });

    it('renders nothing when inactive', () => {
        const { root } = render(<ConfettiBurst active={false} />);
        expect(root.findAll(node => node.props['data-testid'] === 'confetti-piece')).toHaveLength(0);
    });
});

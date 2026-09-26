import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { FullScreenImageModal } from './FullScreenImageModal';

describe('FullScreenImageModal', () => {
    it('renders the photo when visible', () => {
        const onClose = vi.fn();
        const { getByLabelText, root } = render(
            <FullScreenImageModal
                visible
                source={{ uri: 'file:///avatar.jpg' }}
                accessibilityLabel="Profile photo"
                onClose={onClose}
            />,
        );

        expect(root.findAll(node => node.props.src === 'file:///avatar.jpg').length).toBeGreaterThan(0);
        expect(getByLabelText('Profile photo')).toBeTruthy();
        fireEvent.press(getByLabelText('Close modal'));
        expect(onClose).toHaveBeenCalled();
    });

    it('does not render content when hidden', () => {
        const { queryByText } = render(
            <FullScreenImageModal visible={false} accessibilityLabel="Profile photo" onClose={vi.fn()} />,
        );
        expect(queryByText('Close modal')).toBeNull();
    });
});

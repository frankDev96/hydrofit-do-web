import React from 'react';
import { act } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import { IconSize } from '@theme';
import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
    it('renders initials when no photo is provided', () => {
        const { getByLabelText, getByText } = render(<UserAvatar initials="AR" size={IconSize.headerAvatar} />);

        expect(getByLabelText('AR')).toBeTruthy();
        expect(getByText('AR')).toBeTruthy();
    });

    it('falls back to initials and notifies when the photo fails to load', () => {
        const onError = vi.fn();
        const { getByText, root } = render(
            <UserAvatar
                source={{ uri: 'file:///gone.jpg' }}
                initials="U"
                onError={onError}
                size={IconSize.headerAvatar}
            />,
        );

        act(() => {
            root.findByType('img').props.onError?.();
        });

        expect(onError).toHaveBeenCalledTimes(1);
        expect(getByText('U')).toBeTruthy();
    });

    it('uses fallback art when initials are empty', () => {
        const { root } = render(<UserAvatar fallbackSource={{ uri: '/avatar.png' }} size={IconSize.badge} />);
        expect(root.findByType('img').props.src).toBe('/avatar.png');
        expect(root.findByType('img').props.style.objectFit).toBe('contain');
    });
});

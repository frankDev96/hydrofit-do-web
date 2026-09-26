import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@/test-utils/render';
import { AdBanner } from './AdBanner';

describe('AdBanner', () => {
    it('renders nothing in the browser companion', () => {
        const { toJSON } = render(<AdBanner />);
        expect(toJSON()).toBeNull();
    });
});

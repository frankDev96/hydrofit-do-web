import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@/test-utils/render';
import AppErrorBoundary from './AppErrorBoundary';

function ThrowingChild(): React.JSX.Element {
    throw new Error('render failure');
}

describe('AppErrorBoundary', () => {
    it('renders children when there is no error', () => {
        const { getByText } = render(
            <AppErrorBoundary>
                <span>Healthy tree</span>
            </AppErrorBoundary>,
        );

        expect(getByText('Healthy tree')).toBeTruthy();
    });

    it('renders the fallback UI when a child throws', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        const { getByText } = render(
            <AppErrorBoundary>
                <ThrowingChild />
            </AppErrorBoundary>,
        );

        expect(getByText('Something went wrong.')).toBeTruthy();
        expect(getByText(/Reload the page/)).toBeTruthy();
        spy.mockRestore();
    });
});

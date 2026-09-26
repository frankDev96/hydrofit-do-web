import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@/test-utils/render';
import { CommonModal, CommonModalSection } from './CommonModal';

describe('CommonModal', () => {
    it('renders title, close control, and section children when visible', () => {
        const onClose = vi.fn();
        const { getByText, getByLabelText } = render(
            <CommonModal visible title="Test Modal" onClose={onClose}>
                <CommonModalSection label="SECTION LABEL">
                    <span>Section body</span>
                </CommonModalSection>
            </CommonModal>,
        );

        expect(getByText('Test Modal')).toBeTruthy();
        expect(getByText('SECTION LABEL')).toBeTruthy();
        expect(getByText('Section body')).toBeTruthy();
        expect(getByLabelText('Close modal')).toBeTruthy();
    });

    it('does not render content when hidden', () => {
        const onClose = vi.fn();
        const { queryByText } = render(
            <CommonModal visible={false} title="Hidden Modal" onClose={onClose}>
                <CommonModalSection label="HIDDEN">
                    <span>Hidden body</span>
                </CommonModalSection>
            </CommonModal>,
        );

        expect(queryByText('Hidden Modal')).toBeNull();
    });

    it('renders a dialog when visible', () => {
        const { root, getByText } = render(
            <CommonModal visible title="Translucent" onClose={vi.fn()}>
                <CommonModalSection>
                    <span>Body</span>
                </CommonModalSection>
            </CommonModal>,
        );

        expect(root.find(node => node.props.role === 'dialog')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
    });

    it('calls onClose from close button and backdrop', () => {
        const onClose = vi.fn();
        const { getByLabelText } = render(
            <CommonModal visible title="Closable" onClose={onClose}>
                <CommonModalSection>
                    <span>Body</span>
                </CommonModalSection>
            </CommonModal>,
        );

        fireEvent.press(getByLabelText('Close modal'));
        expect(onClose).toHaveBeenCalledTimes(1);

        fireEvent.press(getByLabelText('Close backdrop'));
        expect(onClose).toHaveBeenCalledTimes(2);
    });
});

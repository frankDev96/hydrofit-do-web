import React from 'react';
import TestRenderer, { act, type ReactTestInstance } from 'react-test-renderer';

function collectText(node: ReactTestInstance): string[] {
    const parts: string[] = [];

    if (typeof node.props.children === 'string' || typeof node.props.children === 'number') {
        parts.push(String(node.props.children));
    } else if (Array.isArray(node.props.children)) {
        node.props.children.forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                parts.push(String(child));
            }
        });
    }

    node.children.forEach(child => {
        if (typeof child !== 'string') {
            parts.push(...collectText(child));
        }
    });

    return parts;
}

function nodeMatchesText(node: ReactTestInstance, matcher: string | RegExp): boolean {
    const text = collectText(node).join('');
    return typeof matcher === 'string' ? text.includes(matcher) : matcher.test(text);
}

function findNode(root: ReactTestInstance, predicate: (node: ReactTestInstance) => boolean): ReactTestInstance {
    const matches = root.findAll(node => predicate(node));

    if (matches.length === 0) {
        throw new Error('Unable to find matching node');
    }

    return matches[0]!;
}

function pressHandler(node: ReactTestInstance): (() => void) | undefined {
    const handler = node.props.onClick ?? node.props.onPress;
    return typeof handler === 'function' ? handler : undefined;
}

function isEnabledPressable(node: ReactTestInstance): boolean {
    return pressHandler(node) !== undefined && node.props.disabled !== true;
}

function nodeLabel(node: ReactTestInstance): string | undefined {
    const label = node.props['aria-label'] ?? node.props.accessibilityLabel;
    return typeof label === 'string' ? label : undefined;
}

function getPressableByText(root: ReactTestInstance, matcher: string | RegExp): ReactTestInstance {
    const pressables = root.findAll(node => isEnabledPressable(node) && nodeMatchesText(node, matcher));

    if (pressables.length === 0) {
        throw new Error(`Unable to find pressable matching: ${String(matcher)}`);
    }

    return pressables[0]!;
}

function getPressableByLabel(root: ReactTestInstance, label: string): ReactTestInstance {
    const pressables = root.findAll(node => nodeLabel(node) === label && isEnabledPressable(node));

    if (pressables.length === 0) {
        throw new Error(`Unable to find pressable with label: ${label}`);
    }

    return pressables[0]!;
}

export function render(element: React.ReactElement) {
    let tree!: TestRenderer.ReactTestRenderer;

    act(() => {
        tree = TestRenderer.create(element);
    });

    return {
        root: tree.root,
        getByText: (matcher: string | RegExp) => findNode(tree.root, node => nodeMatchesText(node, matcher)),
        getPressableByText: (matcher: string | RegExp) => getPressableByText(tree.root, matcher),
        queryByText: (matcher: string | RegExp) => {
            try {
                return findNode(tree.root, node => nodeMatchesText(node, matcher));
            } catch {
                return null;
            }
        },
        getByLabelText: (label: string) => findNode(tree.root, node => nodeLabel(node) === label),
        getPressableByLabel: (label: string) => getPressableByLabel(tree.root, label),
        toJSON: () => tree.toJSON(),
        unmount: () => {
            act(() => {
                tree.unmount();
            });
        },
    };
}

export const fireEvent = {
    press: (node: ReactTestInstance) => {
        act(() => {
            pressHandler(node)?.();
        });
    },
    changeText: (node: ReactTestInstance, text: string) => {
        act(() => {
            if (typeof node.props.onChangeText === 'function') {
                node.props.onChangeText(text);
            }
        });
    },
    change: (node: ReactTestInstance, value: string) => {
        act(() => {
            if (typeof node.props.onChange === 'function') {
                node.props.onChange({ target: { value } });
            }
        });
    },
};

export type RenderResult = ReturnType<typeof render>;

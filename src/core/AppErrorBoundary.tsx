import React from 'react';
import { absoluteFill, css } from '@/common/css';
import { Colors, Spacing, Typography } from '@theme';

type Props = {
    children: React.ReactNode;
};

type State = {
    hasError: boolean;
};

export default class AppErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error): void {
        console.error('AppErrorBoundary caught a render error', error);
    }

    public render(): React.JSX.Element {
        if (this.state.hasError) {
            return (
                <div style={styles.container}>
                    <span style={css(styles.title)}>Something went wrong.</span>
                    <span style={css(styles.message)}>Reload the page. If the issue continues, try again.</span>
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.lg,
        backgroundColor: Colors.background,
    },
    title: {
        ...Typography.titleLarge,
        color: Colors.text,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    message: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
};

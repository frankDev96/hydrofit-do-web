import { defineConfig } from 'vitest/config';
import path from 'node:path';

const root = import.meta.dirname;

function dir(folder: string) {
    return path.resolve(root, folder);
}

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
        coverage: {
            provider: 'v8',
            reportsDirectory: './coverage',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/test-utils/**',
                'src/**/*.d.ts',
                'src/**/types/**',
                'src/**/index.ts',
            ],
        },
    },
    resolve: {
        alias: [
            { find: /^@theme\/(.*)/, replacement: `${dir('src/theme')}/$1` },
            { find: /^@theme$/, replacement: dir('src/theme/index.ts') },
            { find: /^@core\/(.*)/, replacement: `${dir('src/core')}/$1` },
            { find: /^@core$/, replacement: dir('src/core/index.ts') },
            { find: /^@common\/ui$/, replacement: dir('src/common/ui/index.ts') },
            { find: /^@common\/(.*)/, replacement: `${dir('src/common')}/$1` },
            { find: /^@stores\/(.*)/, replacement: `${dir('src/stores')}/$1` },
            { find: /^@stores$/, replacement: dir('src/stores/index.ts') },
            { find: /^@i18n\/(.*)/, replacement: `${dir('src/i18n')}/$1` },
            { find: /^@i18n$/, replacement: dir('src/i18n/index.ts') },
            { find: /^@navigation\/(.*)/, replacement: `${dir('src/navigation')}/$1` },
            { find: /^@navigation$/, replacement: dir('src/navigation/index.ts') },
            { find: /^@modules\/(.*)/, replacement: `${dir('src/modules')}/$1` },
            { find: /^@\/(.*)/, replacement: `${dir('src')}/$1` },
            { find: 'react-native-svg', replacement: dir('src/shims/react-native-svg.tsx') },
            { find: 'react-native', replacement: dir('vitest/mocks/react-native.tsx') },
            { find: 'react-native-mmkv', replacement: dir('vitest/mocks/mmkv.ts') },
            { find: '@notifee/react-native', replacement: dir('vitest/mocks/notifee.ts') },
            { find: 'react-native-reanimated', replacement: dir('vitest/mocks/reanimated.tsx') },
            { find: 'react-native-drum-picker', replacement: dir('vitest/mocks/react-native-drum-picker.tsx') },
            { find: '@shopify/react-native-skia', replacement: dir('vitest/mocks/skia.tsx') },
            {
                find: 'react-native-keyboard-controller',
                replacement: dir('vitest/mocks/react-native-keyboard-controller.tsx'),
            },
            { find: 'react-native-gesture-handler', replacement: dir('vitest/mocks/gesture-handler.ts') },
            { find: '@react-native-community/datetimepicker', replacement: dir('vitest/mocks/datetimepicker.tsx') },
            { find: 'react-native-google-mobile-ads', replacement: dir('vitest/mocks/google-mobile-ads.tsx') },
            { find: 'react-native-android-widget', replacement: dir('vitest/mocks/android-widget.tsx') },
            {
                find: 'react-native-safe-area-context',
                replacement: dir('src/shims/react-native-safe-area-context.tsx'),
            },
            { find: '@react-native-community/netinfo', replacement: dir('src/shims/netinfo.ts') },
            { find: '@react-navigation/native-stack', replacement: dir('src/shims/native-stack.tsx') },
            { find: '@react-navigation/native', replacement: dir('src/shims/react-navigation.tsx') },
        ],
    },
});

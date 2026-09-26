(globalThis as typeof globalThis & { __DEV__: boolean }).__DEV__ = process.env.NODE_ENV !== 'production';

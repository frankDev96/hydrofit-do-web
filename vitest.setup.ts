import { createRequire } from 'node:module';
import { vi } from 'vitest';

(globalThis as { __DEV__?: boolean }).__DEV__ = true;

/**
 * Vitest registers Vite's asset extension list as-is, and that list holds the
 * pattern `jpe?g`, so `require('./x.jpg')` falls through to the JS loader and
 * dies on the binary. Reuse the loader Vitest installed for `.png`.
 */
const nodeRequire = createRequire(import.meta.url);
const assetLoader = nodeRequire.extensions['.png'];
if (assetLoader) {
    nodeRequire.extensions['.jpg'] = assetLoader;
    nodeRequire.extensions['.jpeg'] = assetLoader;
}

vi.mock('./src/stores/deviceStore', () => import('./vitest/mocks/mmkv'));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

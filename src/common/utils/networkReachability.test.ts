import { describe, expect, it, vi } from 'vitest';
import { isLikelyNetworkError, isNetworkReachable } from './networkReachability';

describe('isLikelyNetworkError', () => {
    it('detects common offline messages', () => {
        expect(isLikelyNetworkError(new Error('Network request failed'))).toBe(true);
        expect(isLikelyNetworkError(new Error('timeout'))).toBe(true);
        expect(isLikelyNetworkError(new Error('Something else'))).toBe(false);
    });
});

describe('isNetworkReachable', () => {
    it('returns true when the probe succeeds', async () => {
        const fetchImpl = vi.fn(async () => ({ ok: true })) as unknown as typeof fetch;
        await expect(isNetworkReachable(fetchImpl, 1000)).resolves.toBe(true);
    });

    it('returns false when the probe rejects', async () => {
        const fetchImpl = vi.fn(async () => {
            throw new Error('Network request failed');
        }) as unknown as typeof fetch;
        await expect(isNetworkReachable(fetchImpl, 1000)).resolves.toBe(false);
    });
});

/**
 * Lightweight reachability probe for features that need the public internet
 * (e.g. OpenStreetMap Nominatim reverse geocode).
 */
export async function isNetworkReachable(fetchImpl: typeof fetch = fetch, timeoutMs = 4000): Promise<boolean> {
    try {
        const probe = fetchImpl('https://clients3.google.com/generate_204', {
            method: 'GET',
        }).then(
            () => true,
            () => false,
        );
        const timedOut = new Promise<boolean>(resolve => {
            setTimeout(() => resolve(false), timeoutMs);
        });
        return await Promise.race([probe, timedOut]);
    } catch {
        return false;
    }
}

export function isLikelyNetworkError(error: unknown): boolean {
    const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
    return (
        message.includes('network') ||
        message.includes('failed to fetch') ||
        message.includes('internet') ||
        message.includes('offline') ||
        message.includes('timeout') ||
        message.includes('timed out') ||
        message.includes('unreachable')
    );
}

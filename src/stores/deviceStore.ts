const memory = new Map<string, string | number | boolean>();
const STORAGE_KEY = 'hydrofit-device-store';
let loaded = false;

function persist(): void {
    if (typeof window === 'undefined') return;
    const record: Record<string, string | number | boolean> = {};
    for (const [key, value] of memory) {
        record[key] = value;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

function hydrate(): void {
    if (loaded || typeof window === 'undefined') return;
    loaded = true;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw) as Record<string, string | number | boolean>;
        for (const [key, value] of Object.entries(parsed)) {
            memory.set(key, value);
        }
    } catch {
        memory.clear();
    }
}

/** Browser key-value store used by Zustand persist adapters. */
export class DeviceStore {
    getString(key: string): string | undefined {
        hydrate();
        const value = memory.get(key);
        return typeof value === 'string' ? value : undefined;
    }

    getNumber(key: string): number | undefined {
        hydrate();
        const value = memory.get(key);
        return typeof value === 'number' ? value : undefined;
    }

    getBoolean(key: string): boolean | undefined {
        hydrate();
        const value = memory.get(key);
        return typeof value === 'boolean' ? value : undefined;
    }

    set(key: string, value: string | number | boolean): void {
        hydrate();
        memory.set(key, value);
        persist();
    }

    delete(key: string): void {
        hydrate();
        memory.delete(key);
        persist();
    }

    clearAll(): void {
        memory.clear();
        loaded = true;
        persist();
    }
}

export const deviceStore = new DeviceStore();

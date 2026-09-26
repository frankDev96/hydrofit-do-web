const data = new Map<string, string | number | boolean>();

export function resetMmkv(): void {
    data.clear();
}

export class MMKV {
    getString(key: string): string | undefined {
        const value = data.get(key);
        return typeof value === 'string' ? value : undefined;
    }

    getNumber(key: string): number | undefined {
        const value = data.get(key);
        return typeof value === 'number' ? value : undefined;
    }

    getBoolean(key: string): boolean | undefined {
        const value = data.get(key);
        return typeof value === 'boolean' ? value : undefined;
    }

    set(key: string, value: string | number | boolean): void {
        data.set(key, value);
    }

    delete(key: string): void {
        data.delete(key);
    }

    clearAll(): void {
        data.clear();
    }
}

export { MMKV as DeviceStore };
export const deviceStore = new MMKV();

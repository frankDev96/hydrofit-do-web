import { toLocalDateKey } from '@common/utils';
import { deviceStore } from '@stores/storage';

const LAST_RESET_KEY = 'lastResetDate';

type ResetCallback = () => void;

const resetCallbacks: ResetCallback[] = [];
let networkUnsubscribe: (() => void) | null = null;
let wasOnline: boolean | null = null;

function registerResetCallback(cb: ResetCallback): void {
    resetCallbacks.push(cb);
}

function onForegroundMount(): void {
    const today = toLocalDateKey();
    const lastReset = deviceStore.getString(LAST_RESET_KEY);

    if (lastReset !== today) {
        for (const cb of resetCallbacks) {
            cb();
        }
        deviceStore.set(LAST_RESET_KEY, today);
    }
}

function startNetworkListener(): () => void {
    if (networkUnsubscribe || typeof window === 'undefined') {
        return stopNetworkListener;
    }

    const onChange = (): void => {
        const isOnline = navigator.onLine;
        if (isOnline && wasOnline === false) {
            // Reserved for reconnect work.
        }
        wasOnline = isOnline;
    };

    window.addEventListener('online', onChange);
    window.addEventListener('offline', onChange);
    networkUnsubscribe = () => {
        window.removeEventListener('online', onChange);
        window.removeEventListener('offline', onChange);
    };

    return stopNetworkListener;
}

function stopNetworkListener(): void {
    networkUnsubscribe?.();
    networkUnsubscribe = null;
    wasOnline = null;
}

const AppLifecycleService = {
    onForegroundMount,
    registerResetCallback,
    startNetworkListener,
    stopNetworkListener,
};

export default AppLifecycleService;

export type PendingWidgetLog = {
    amountMl: number;
    loggedAtMs: number;
};

async function isPinSupported(): Promise<boolean> {
    return false;
}

async function requestPin(): Promise<boolean> {
    return false;
}

async function openApp(): Promise<boolean> {
    return false;
}

function peekPendingLogsSync(): PendingWidgetLog[] {
    return [];
}

async function peekPendingLogs(): Promise<PendingWidgetLog[]> {
    return [];
}

function isNightModeKnown(): boolean {
    return false;
}

function isNightModeSync(): boolean {
    return false;
}

async function clearPendingLogs(): Promise<boolean> {
    return false;
}

async function drainPendingLogs(): Promise<PendingWidgetLog[]> {
    return [];
}

async function requestRedraw(): Promise<boolean> {
    return false;
}

const WidgetPinService = {
    isPinSupported,
    requestPin,
    openApp,
    peekPendingLogs,
    peekPendingLogsSync,
    isNightModeKnown,
    isNightModeSync,
    clearPendingLogs,
    drainPendingLogs,
    requestRedraw,
};

export default WidgetPinService;

import { parseIntakeQuickPreset } from '@common/constants';
import { toLocalDateKey } from '@common/utils';
import type { PendingWidgetLog } from '@core';
import type { HydrationIntakeLog, LocalDateKey } from './useHydrationStore';

type PersistEnvelope = {
    state?: Record<string, unknown>;
    version?: number;
};

function isIntakeLog(value: unknown): value is HydrationIntakeLog {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const row = value as Record<string, unknown>;
    return (
        typeof row.id === 'string' &&
        typeof row.amountMl === 'number' &&
        Number.isFinite(row.amountMl) &&
        typeof row.loggedAtMs === 'number'
    );
}

function recordsFromUnknown(value: unknown): HydrationIntakeLog[] {
    return Array.isArray(value) ? value.filter(isIntakeLog) : [];
}

function intakeByDateFromUnknown(value: unknown): Record<LocalDateKey, HydrationIntakeLog[]> {
    if (!value || typeof value !== 'object') {
        return {};
    }
    const buckets: Record<LocalDateKey, HydrationIntakeLog[]> = {};
    for (const [dateKey, logs] of Object.entries(value as Record<string, unknown>)) {
        buckets[dateKey] = recordsFromUnknown(logs);
    }
    return buckets;
}

function hasLog(records: HydrationIntakeLog[], amountMl: number, loggedAtMs: number): boolean {
    return records.some(record => record.amountMl === amountMl && record.loggedAtMs === loggedAtMs);
}

/**
 * Fold native widget taps into the Zustand persist JSON so a killed-process
 * rehydrate still sees millilitre chips that never reached addIntake.
 */
export function mergeHydrationPersistWithWidgetLogs(
    raw: string | null | undefined,
    pending: PendingWidgetLog[],
): string | null {
    const valid = pending.filter(log => parseIntakeQuickPreset(log.amountMl) != null);
    if (valid.length === 0) {
        return raw ?? null;
    }

    let parsed: PersistEnvelope = { state: {}, version: 0 };
    if (raw) {
        try {
            const value: unknown = JSON.parse(raw);
            if (value && typeof value === 'object') {
                parsed = value as PersistEnvelope;
            }
        } catch {
            parsed = { state: {}, version: 0 };
        }
    }

    const state = { ...(parsed.state ?? {}) };
    const todayKey = toLocalDateKey();
    const intakeByDate = intakeByDateFromUnknown(state.intakeByDate);
    const existing = [...(intakeByDate[todayKey] ?? [])];

    for (const log of valid) {
        const amountMl = parseIntakeQuickPreset(log.amountMl);
        if (amountMl == null || hasLog(existing, amountMl, log.loggedAtMs)) {
            continue;
        }
        existing.push({
            id: `widget-${log.loggedAtMs}-${amountMl}`,
            amountMl,
            loggedAtMs: log.loggedAtMs,
        });
    }

    const todayRecords = [...existing].sort((left, right) => right.loggedAtMs - left.loggedAtMs);
    const todayIntakeMl = todayRecords.reduce((total, record) => total + record.amountMl, 0);
    intakeByDate[todayKey] = todayRecords;

    return JSON.stringify({
        ...parsed,
        state: {
            ...state,
            todayKey,
            todayRecords,
            todayIntakeMl,
            intakeByDate,
        },
    });
}

'use client';

import { useState } from 'react';
import { useHydro } from '@/components/hydro-context';
import { dayTotal, formatVolume, rangeKeys, weekdayLabel } from '@/lib/hydration';

const RANGES = ['Day', 'Week', 'Month', 'Year'] as const;
type Range = (typeof RANGES)[number];

export default function StatsPage() {
    const hydro = useHydro();
    const [range, setRange] = useState<Range>('Week');
    const days = range === 'Day' ? 1 : range === 'Week' ? 7 : range === 'Month' ? 30 : 365;
    const keys = range === 'Year' ? monthKeys() : rangeKeys(days);
    const totals = keys.map(key => {
        if (range === 'Year') {
            return Object.entries(hydro.state.intakeByDate)
                .filter(([date]) => date.startsWith(key))
                .reduce((sum, [, logs]) => sum + dayTotal(logs), 0);
        }
        return dayTotal(hydro.state.intakeByDate[key]);
    });
    const max = Math.max(hydro.targetMl, ...totals, 1);
    const loggedDays = keys.filter((_, index) => (totals[index] ?? 0) > 0);
    const goalDays = keys.filter((_, index) => (totals[index] ?? 0) >= hydro.targetMl);
    const average =
        loggedDays.length === 0 ? 0 : totals.reduce((sum, value) => sum + value, 0) / Math.max(1, keys.length);

    return (
        <main className="px-5 pt-6">
            <h1 className="text-2xl font-semibold">Stats</h1>
            <div className="mt-4 grid grid-cols-4 rounded-full bg-[var(--surface)] p-1">
                {RANGES.map(item => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setRange(item)}
                        className={`h-10 rounded-full text-sm font-semibold ${item === range ? 'bg-[var(--primary)] text-white' : ''}`}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex h-40 items-end gap-1">
                    {totals.map((total, index) => (
                        <div key={keys[index]} className="flex h-full flex-1 items-end">
                            <div
                                className="w-full rounded-t-md bg-[var(--primary)]"
                                style={{ height: `${Math.max(4, (total / max) * 100)}%` }}
                                title={`${keys[index]}: ${total} ml`}
                            />
                        </div>
                    ))}
                </div>
                {range === 'Week' ? (
                    <div className="mt-2 flex gap-1 text-center text-[10px] text-[var(--faint)]">
                        {keys.map(key => (
                            <span key={key} className="flex-1">
                                {weekdayLabel(key)}
                            </span>
                        ))}
                    </div>
                ) : null}
            </section>
            <div className="mt-3 grid grid-cols-2 gap-3">
                <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs text-[var(--faint)]">Average intake</p>
                    <p className="mt-1 text-xl font-semibold">{formatVolume(average, hydro.state.volumeUnit)}</p>
                </article>
                <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs text-[var(--faint)]">Goal met</p>
                    <p className="mt-1 text-xl font-semibold">
                        {goalDays.length}/{keys.length}
                    </p>
                </article>
                <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs text-[var(--faint)]">Habit consistency</p>
                    <p className="mt-1 text-xl font-semibold">{hydro.streak} day streak</p>
                </article>
                <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-xs text-[var(--faint)]">Total logged</p>
                    <p className="mt-1 text-xl font-semibold">{formatVolume(hydro.totalMl, hydro.state.volumeUnit)}</p>
                </article>
            </div>
        </main>
    );
}

function monthKeys(): string[] {
    const year = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, month) => `${year}-${String(month + 1).padStart(2, '0')}`);
}

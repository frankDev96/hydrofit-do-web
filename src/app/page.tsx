'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProgressRing } from '@/components/progress-ring';
import { containerChoices, useHydro } from '@/components/hydro-context';
import { formatVolume } from '@/lib/hydration';

function clock(ms: number): string {
    return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function HomePage() {
    const hydro = useHydro();
    const [customMl, setCustomMl] = useState('200');
    const [when, setWhen] = useState('');
    const progress = hydro.targetMl > 0 ? hydro.todayMl / hydro.targetMl : 0;
    const choices = containerChoices(hydro.state.customContainers);
    const selected = choices.find(item => item.amountMl === hydro.state.selectedContainerMl) ?? choices[1];

    function logAt(amount: number) {
        if (!when) {
            hydro.logIntake(amount);
            return;
        }
        const loggedAtMs = new Date(`${hydro.todayKey}T${when}`).getTime();
        if (Number.isFinite(loggedAtMs)) hydro.logIntake(amount, loggedAtMs);
    }

    return (
        <main className="px-5 pt-6">
            <header className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm text-[var(--faint)]">Hydrofit.do Web</p>
                    <h1 className="text-2xl font-semibold">
                        {hydro.state.displayName ? `Hi, ${hydro.state.displayName}` : 'Today'}
                    </h1>
                </div>
                <div className="flex gap-2 text-sm font-semibold">
                    <Link className="rounded-full bg-[var(--wash)] px-3 py-2 text-[var(--primary-deep)]" href="/tips">
                        Tips
                    </Link>
                    <Link
                        className="relative rounded-full bg-[var(--wash)] px-3 py-2 text-[var(--primary-deep)]"
                        href="/notifications"
                    >
                        Inbox
                        {hydro.state.inbox.length > 0 ? (
                            <span className="ml-1 rounded-full bg-[var(--primary)] px-1.5 text-xs text-white">
                                {hydro.state.inbox.length}
                            </span>
                        ) : null}
                    </Link>
                    <Link
                        className="rounded-full bg-[var(--wash)] px-3 py-2 text-[var(--primary-deep)]"
                        href="/settings"
                    >
                        Settings
                    </Link>
                </div>
            </header>

            <section className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <ProgressRing
                    progress={progress}
                    label={formatVolume(hydro.todayMl, hydro.state.volumeUnit)}
                    sublabel={`of ${formatVolume(hydro.targetMl, hydro.state.volumeUnit)}`}
                />
                <p className="mt-2 text-center text-sm text-[var(--muted)]">
                    {hydro.streak > 0 ? `${hydro.streak} day streak` : 'Log water to start a streak'} · Level{' '}
                    {hydro.level}
                </p>
                <p className="mt-1 text-center text-sm text-[var(--faint)]">
                    {hydro.nextReminderLabel
                        ? `Next reminder ${hydro.nextReminderLabel}`
                        : 'No reminder left before bedtime'}
                </p>
                <button
                    type="button"
                    className="mt-4 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                    onClick={() => logAt(selected?.amountMl ?? hydro.state.selectedContainerMl)}
                >
                    Log {formatVolume(selected?.amountMl ?? 250, hydro.state.volumeUnit)}
                </button>
                <div className="mt-3 grid grid-cols-4 gap-2">
                    {choices.slice(0, 4).map(item => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => hydro.setSelectedContainer(item.amountMl)}
                            className={`rounded-2xl border px-2 py-3 text-xs font-semibold ${
                                item.amountMl === hydro.state.selectedContainerMl
                                    ? 'border-[var(--primary)] bg-[var(--wash)] text-[var(--primary-deep)]'
                                    : 'border-[var(--border)]'
                            }`}
                        >
                            {formatVolume(item.amountMl, hydro.state.volumeUnit)}
                            <span className="mt-1 block font-normal text-[var(--faint)]">{item.name}</span>
                        </button>
                    ))}
                </div>
                <div className="mt-3 flex gap-2">
                    <input
                        aria-label="Custom amount in millilitres"
                        inputMode="numeric"
                        value={customMl}
                        onChange={event => setCustomMl(event.target.value)}
                        className="h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3"
                    />
                    <input
                        aria-label="Log time"
                        type="time"
                        value={when}
                        onChange={event => setWhen(event.target.value)}
                        className="h-11 rounded-2xl border border-[var(--border)] bg-transparent px-3"
                    />
                    <button
                        type="button"
                        className="h-11 shrink-0 rounded-2xl bg-[var(--primary-deep)] px-4 font-semibold text-white"
                        onClick={() => {
                            const amount = Number(customMl);
                            if (!when) {
                                hydro.logIntake(amount);
                                return;
                            }
                            const loggedAtMs = new Date(`${hydro.todayKey}T${when}`).getTime();
                            if (Number.isFinite(loggedAtMs)) hydro.logIntake(amount, loggedAtMs);
                        }}
                    >
                        Add
                    </button>
                </div>
                <Link
                    href="/containers"
                    className="mt-3 block text-center text-sm font-semibold text-[var(--primary-deep)]"
                >
                    Choose a container
                </Link>
            </section>

            <section className="mt-5">
                <h2 className="text-sm font-semibold tracking-wide text-[var(--faint)]">TODAY</h2>
                {hydro.todayLogs.length === 0 ? (
                    <p className="mt-3 rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
                        No water logged yet. A glass now starts the day.
                    </p>
                ) : (
                    <ul className="mt-3 space-y-2">
                        {[...hydro.todayLogs].reverse().map(log => (
                            <li
                                key={log.id}
                                className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                            >
                                <span>
                                    <span className="font-semibold">
                                        {formatVolume(log.amountMl, hydro.state.volumeUnit)}
                                    </span>
                                    <span className="ml-2 text-sm text-[var(--faint)]">{clock(log.loggedAtMs)}</span>
                                </span>
                                <button
                                    type="button"
                                    className="text-sm text-[var(--faint)]"
                                    onClick={() => hydro.removeLog(log.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useHydro } from '@/components/hydro-context';
import { formatWeight, kgToLbs, lbsToKg, type ReminderMode, type VolumeUnit, type WeightUnit } from '@/lib/hydration';

export default function SettingsPage() {
    const hydro = useHydro();
    const router = useRouter();
    const [confirmReset, setConfirmReset] = useState(false);
    const [notice, setNotice] = useState('');

    function setWeightFromInput(raw: string, unit: WeightUnit) {
        const value = Number(raw);
        if (!Number.isFinite(value) || value <= 0) return;
        hydro.updateBody({ weightKg: unit === 'lbs' ? lbsToKg(value) : value, weightUnit: unit });
    }

    async function enableNotifications() {
        if (typeof Notification === 'undefined') {
            setNotice('This browser does not show system notifications.');
            return;
        }
        const permission = await Notification.requestPermission();
        setNotice(
            permission === 'granted'
                ? 'Reminders can appear while this site is open.'
                : 'Notification permission was not granted.',
        );
    }

    return (
        <main className="px-5 pt-6 pb-8">
            <h1 className="text-2xl font-semibold">Settings</h1>
            <section className="mt-5 space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h2 className="text-xs font-semibold tracking-wide text-[var(--faint)]">PERSONAL INFORMATION</h2>
                <label className="block text-sm">
                    Weight ({hydro.state.weightUnit})
                    <input
                        key={`${hydro.state.weightUnit}-${Math.round(hydro.state.weightKg)}`}
                        defaultValue={
                            hydro.state.weightUnit === 'lbs'
                                ? String(Math.round(kgToLbs(hydro.state.weightKg)))
                                : String(Math.round(hydro.state.weightKg))
                        }
                        inputMode="decimal"
                        onBlur={event => setWeightFromInput(event.target.value, hydro.state.weightUnit)}
                        className="mt-1 h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3"
                    />
                </label>
                <p className="text-sm text-[var(--muted)]">
                    Saved as {formatWeight(hydro.state.weightKg, hydro.state.weightUnit)}. Target uses kilograms × 33.
                </p>
                <div className="flex gap-2">
                    {(['kg', 'lbs'] as const).map(unit => (
                        <button
                            key={unit}
                            type="button"
                            onClick={() => hydro.updateBody({ weightUnit: unit })}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${hydro.state.weightUnit === unit ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)]'}`}
                        >
                            {unit}
                        </button>
                    ))}
                </div>
                <label className="block text-sm">
                    Wake-up time
                    <input
                        type="time"
                        value={hydro.state.wakeTime}
                        onChange={event => hydro.updateBody({ wakeTime: event.target.value })}
                        className="mt-1 h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3"
                    />
                </label>
                <label className="block text-sm">
                    Bedtime
                    <input
                        type="time"
                        value={hydro.state.bedTime}
                        onChange={event => hydro.updateBody({ bedTime: event.target.value })}
                        className="mt-1 h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3"
                    />
                </label>
            </section>

            <section className="mt-4 space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h2 className="text-xs font-semibold tracking-wide text-[var(--faint)]">GENERAL</h2>
                <div className="flex items-center justify-between">
                    <span>Dark mode</span>
                    <button
                        type="button"
                        aria-label="Dark mode switch"
                        onClick={() => hydro.updateBody({ theme: hydro.state.theme === 'dark' ? 'light' : 'dark' })}
                        className={`h-8 w-14 rounded-full p-1 ${hydro.state.theme === 'dark' ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
                    >
                        <span
                            className={`block h-6 w-6 rounded-full bg-white ${hydro.state.theme === 'dark' ? 'translate-x-6' : ''}`}
                        />
                    </button>
                </div>
                <p className="text-sm">Volume unit</p>
                <div className="flex gap-2">
                    {(['ml', 'flOz'] as const satisfies readonly VolumeUnit[]).map(unit => (
                        <button
                            key={unit}
                            type="button"
                            onClick={() => hydro.updateBody({ volumeUnit: unit })}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${hydro.state.volumeUnit === unit ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)]'}`}
                        >
                            {unit === 'ml' ? 'Metric (ml)' : 'Imperial (fl oz)'}
                        </button>
                    ))}
                </div>
                <p className="text-sm">Reminder mode</p>
                <div className="grid grid-cols-3 gap-2">
                    {(
                        [
                            ['sound', 'Sound'],
                            ['display', 'Display'],
                            ['off', 'Off'],
                        ] as const satisfies ReadonlyArray<readonly [ReminderMode, string]>
                    ).map(([mode, label]) => (
                        <button
                            key={mode}
                            type="button"
                            onClick={() => hydro.updateBody({ reminderMode: mode, remindersEnabled: mode !== 'off' })}
                            className={`h-10 rounded-2xl text-sm font-semibold ${hydro.state.reminderMode === mode ? 'bg-[var(--primary)] text-white' : 'border border-[var(--border)]'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="h-11 w-full rounded-2xl border border-[var(--border)] text-sm font-semibold"
                    onClick={() => void enableNotifications()}
                >
                    Allow browser reminders
                </button>
                {notice ? <p className="text-sm text-[var(--muted)]">{notice}</p> : null}
                <p className="text-sm text-[var(--muted)]">
                    The Android app can remind you in the background. This site reminds you while the tab is open,
                    between wake and bed, about every 2 hours.
                </p>
            </section>

            <section className="mt-4 space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h2 className="text-xs font-semibold tracking-wide text-[var(--faint)]">ABOUT AND LEGAL</h2>
                <Link className="block py-2 font-semibold" href="/privacy">
                    Privacy Policy
                </Link>
                <Link className="block py-2 font-semibold" href="/terms">
                    Terms of Service
                </Link>
                <Link className="block py-2 font-semibold" href="/help">
                    Help and Support
                </Link>
                <p className="text-sm text-[var(--muted)]">
                    Hydrofit.do Web does not show ads. The Android app shows Google AdMob ads and offers Ads & privacy
                    in Settings.
                </p>
            </section>

            <button
                type="button"
                className="mt-4 h-12 w-full rounded-full border border-[var(--border)] font-semibold"
                onClick={() => setConfirmReset(true)}
            >
                Restore to defaults
            </button>
            {confirmReset ? (
                <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-6">
                    <div className="w-full max-w-sm rounded-3xl bg-[var(--surface)] p-5">
                        <h2 className="text-xl font-semibold">Restore to defaults?</h2>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                            User data and preferences in this browser will be removed.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                className="h-11 flex-1 rounded-full border border-[var(--border)]"
                                onClick={() => setConfirmReset(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="h-11 flex-1 rounded-full bg-[var(--primary)] font-semibold text-white"
                                onClick={() => {
                                    hydro.restoreDefaults();
                                    router.replace('/onboarding');
                                }}
                            >
                                Restore
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
}

'use client';

import { useState } from 'react';
import { resizeProfilePhoto, useHydro } from '@/components/hydro-context';
import {
    ACHIEVEMENTS,
    formatVolume,
    formatWeight,
    unlockedAchievements,
    type AchievementId,
    type Gender,
} from '@/lib/hydration';

const BADGE_SRC: Record<AchievementId, string> = {
    'first-drop': '/assets/images/achievements/first-drop.png',
    'target-smasher': '/assets/images/achievements/target-smasher.png',
    'habit-starter': '/assets/images/achievements/habit-starter.png',
    'early-bird': '/assets/images/achievements/early-bird.png',
    centurion: '/assets/images/achievements/centurion.png',
};

export default function ProfilePage() {
    const hydro = useHydro();
    const [name, setName] = useState(hydro.state.displayName);
    const [error, setError] = useState('');
    const unlocked = unlockedAchievements(hydro.state.intakeByDate, hydro.targetMl);

    async function onPhoto(file: File | undefined) {
        if (!file) return;
        try {
            const photoDataUrl = await resizeProfilePhoto(file);
            hydro.updateProfile({ photoDataUrl });
            setError('');
        } catch {
            setError('Could not use that photo. Try another image.');
        }
    }

    return (
        <main className="px-5 pt-6">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-center gap-4">
                    {hydro.state.photoDataUrl ? (
                        // Local data URL chosen by the user. next/image cannot optimize it.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={hydro.state.photoDataUrl}
                            alt="Profile photo"
                            className="h-16 w-16 rounded-full object-cover"
                        />
                    ) : (
                        <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--wash)] text-xl font-semibold text-[var(--primary-deep)]">
                            {(hydro.state.displayName || hydro.state.gender || 'U').slice(0, 1).toUpperCase()}
                        </div>
                    )}
                    <div>
                        <p className="text-lg font-semibold">{hydro.state.displayName || 'User'}</p>
                        <p className="text-sm text-[var(--muted)]">
                            Level {hydro.level} · {hydro.streak} day streak ·{' '}
                            {formatVolume(hydro.totalMl, hydro.state.volumeUnit)} total
                        </p>
                    </div>
                </div>
                <label className="mt-4 block text-sm font-semibold">
                    Name
                    <input
                        value={name}
                        onChange={event => setName(event.target.value)}
                        className="mt-1 h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3 font-normal"
                    />
                </label>
                <label className="mt-3 block text-sm font-semibold">
                    Gender
                    <select
                        value={hydro.state.gender ?? ''}
                        onChange={event => hydro.updateProfile({ gender: event.target.value as Gender })}
                        className="mt-1 h-11 w-full rounded-2xl border border-[var(--border)] bg-transparent px-3 font-normal"
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </label>
                <div className="mt-3 flex gap-2">
                    <label className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-2xl border border-[var(--border)] text-sm font-semibold">
                        Change photo
                        <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={event => void onPhoto(event.target.files?.[0])}
                        />
                    </label>
                    <button
                        type="button"
                        className="h-11 flex-1 rounded-2xl bg-[var(--primary)] font-semibold text-white"
                        onClick={() => hydro.updateProfile({ displayName: name.trim() })}
                    >
                        Save
                    </button>
                </div>
                {hydro.state.photoDataUrl ? (
                    <button
                        type="button"
                        className="mt-2 text-sm text-[var(--faint)]"
                        onClick={() => hydro.updateProfile({ photoDataUrl: null })}
                    >
                        Remove photo
                    </button>
                ) : null}
                {error ? <p className="mt-2 text-sm text-[var(--primary-deep)]">{error}</p> : null}
                <p className="mt-4 text-sm text-[var(--muted)]">
                    {formatWeight(hydro.state.weightKg, hydro.state.weightUnit)} · daily target{' '}
                    {formatVolume(hydro.targetMl, hydro.state.volumeUnit)}
                </p>
            </section>
            <h2 className="mt-6 text-sm font-semibold tracking-wide text-[var(--faint)]">ACHIEVEMENTS</h2>
            <ul className="mt-3 space-y-2">
                {(Object.keys(ACHIEVEMENTS) as Array<keyof typeof ACHIEVEMENTS>).map(id => {
                    const item = ACHIEVEMENTS[id];
                    const open = unlocked.includes(id);
                    return (
                        <li
                            key={id}
                            className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={BADGE_SRC[id]} alt="" className={`h-12 w-12 ${open ? '' : 'opacity-40'}`} />
                            <div>
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-[var(--muted)]">{item.description}</p>
                                <p className="mt-1 text-xs font-semibold text-[var(--primary)]">
                                    {open ? 'Unlocked' : 'Locked'}
                                </p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </main>
    );
}

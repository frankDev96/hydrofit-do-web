'use client';

import Link from 'next/link';
import { useHydro } from '@/components/hydro-context';

function ago(ms: number): string {
    const minutes = Math.round((Date.now() - ms) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
}

export default function NotificationsPage() {
    const hydro = useHydro();
    return (
        <main className="px-5 pt-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Notifications</h1>
                <Link href="/settings" className="text-sm font-semibold text-[var(--primary-deep)]">
                    Settings
                </Link>
            </div>
            {hydro.state.inbox.length === 0 ? (
                <p className="mt-8 text-sm text-[var(--muted)]">
                    You&apos;re all caught up. Milestones and reminders show up here.
                </p>
            ) : (
                <>
                    <button
                        type="button"
                        className="mt-4 text-sm font-semibold text-[var(--primary-deep)]"
                        onClick={hydro.clearInbox}
                    >
                        Clear inbox
                    </button>
                    <ul className="mt-3 space-y-2">
                        {hydro.state.inbox.map(item => (
                            <li
                                key={item.id}
                                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
                            >
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-[var(--muted)]">{item.body}</p>
                                <p className="mt-1 text-xs text-[var(--faint)]">{ago(item.atMs)}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </main>
    );
}

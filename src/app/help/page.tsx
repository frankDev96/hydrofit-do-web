import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Help — Hydrofit.do Web',
};

export default function HelpPage() {
    return (
        <main className="mx-auto max-w-2xl px-5 py-8">
            <h1 className="text-4xl font-semibold">Help and Support</h1>
            <article className="mt-6 space-y-4 text-[var(--muted)]">
                <h2 className="text-xl font-semibold text-[var(--text)]">Getting started</h2>
                <p>
                    Home logs water, Plan shows the schedule, and Stats reviews trends. Settings holds reminders, units,
                    and appearance.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Logging water</h2>
                <p>
                    Tap the log button or add a custom amount and time. Choose a container size from the container
                    screen when 250 ml is not your glass.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Reminders</h2>
                <p>
                    Reminders follow wake and bed times, about every 2 hours. On the web they run while the site is
                    open. The Android app can deliver them in the background. Allow browser reminders in Settings if you
                    want a system notification.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Weather-aware targets</h2>
                <p>Climate bonuses are not used. Daily goals stay at weight × 33 ml.</p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Data</h2>
                <p>
                    Web logs stay in this browser. Android logs stay on the phone. Read the{' '}
                    <Link className="text-[var(--primary-deep)]" href="/privacy">
                        Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link className="text-[var(--primary-deep)]" href="/terms">
                        Terms of Service
                    </Link>
                    . Restore to defaults erases local HydroFit data.
                </p>
            </article>
        </main>
    );
}

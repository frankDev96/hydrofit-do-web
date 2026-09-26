import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy — HydroFit.do',
    description: 'How HydroFit.do handles hydration data on this device.',
};

export default function PrivacyPage() {
    return (
        <main className="mx-auto max-w-2xl px-5 py-8">
            <p className="text-sm font-semibold text-[var(--primary)]">
                <Link href="/">HydroFit.do</Link>
            </p>
            <h1 className="mt-2 text-4xl font-semibold">Privacy Policy</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Last updated September 26, 2026</p>
            <article className="mt-6 space-y-4 text-[var(--muted)]">
                <p>
                    HydroFit.do is a personal hydration companion. This policy describes how it handles your information
                    on this device.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">On this device</h2>
                <p>
                    HydroFit.do stores gender, weight, wake and bed times, intake logs, reminder preferences, and an
                    optional name and profile photo on this device. It does not require an account, and it does not
                    upload that information to a HydroFit cloud or copy it to another device.
                </p>
                <p>
                    You can delete this data yourself. In Settings, the Restore to defaults button erases everything
                    HydroFit has stored: profile details, intake logs, reminder preferences, and any saved name or
                    photo. Nothing from that storage is kept. Removing HydroFit from the device deletes it as well.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">How the data is used</h2>
                <p>
                    HydroFit uses it to calculate a daily target of weight × 33 ml, log water, show a plan and stats,
                    personalize the screen, and send reminders. Targets are estimates, not medical advice.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Advertising</h2>
                <p>
                    When HydroFit shows ads, they are Google AdMob banners and occasional full-screen ads. Google may
                    process device identifiers under{' '}
                    <a className="text-[var(--primary-deep)]" href="https://policies.google.com/privacy">
                        Google&apos;s Privacy Policy
                    </a>
                    . HydroFit does not intentionally send hydration logs or biometrics to AdMob. Where ads are shown,
                    you can review consent in Settings under Ads & privacy.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Your choices</h2>
                <p>
                    You can manage reminder permission in device settings and change reminder mode in Settings. To
                    delete your data, use Restore to defaults in Settings. That button fully erases the data stored in
                    HydroFit. HydroFit does not sell personal information.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Children</h2>
                <p>
                    HydroFit.do is not directed at children under 13. If a child entered information, remove it with
                    Restore to defaults or by removing HydroFit from the device.
                </p>
                <h2 className="text-xl font-semibold text-[var(--text)]">Contact</h2>
                <p>Privacy questions can be sent to the developer contact published for HydroFit.do.</p>
            </article>
        </main>
    );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Hydrofit.do Web",
  description: "How HydroFit.do handles hydration data on Android and in Hydrofit.do Web.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <p className="text-sm font-semibold text-[var(--primary)]">
        <Link href="/">Hydrofit.do Web</Link>
      </p>
      <h1 className="mt-2 text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated September 25, 2026</p>
      <article className="mt-6 space-y-4 text-[var(--muted)]">
        <p>
          HydroFit.do is an Android hydration app (application ID com.hydrofitdo). Hydrofit.do Web is
          the browser companion. This policy covers both.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">On your device</h2>
        <p>
          The Android app stores gender, weight, wake and bed times, intake logs, reminder
          preferences, and an optional name and profile photo on the phone. It does not require an
          account and does not upload that data to a HydroFit cloud. Android backup for the app is
          turned off.
        </p>
        <p>
          Hydrofit.do Web stores the same kinds of details in this browser&apos;s local storage. The
          site does not send your logs or profile to a HydroFit server. Clearing site data, using
          Restore to defaults, or uninstalling the installed web app removes them.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">How the data is used</h2>
        <p>
          HydroFit uses it to calculate a daily target of weight × 33 ml, log water, show a plan and
          stats, personalize the screen, and send reminders. Targets are estimates, not medical
          advice.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Advertising</h2>
        <p>
          The Android app shows Google AdMob banners and occasional full-screen ads. Google may
          process device identifiers under{" "}
          <a className="text-[var(--primary-deep)]" href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy
          </a>
          . HydroFit does not intentionally send hydration logs or biometrics to AdMob. Manage
          consent in the Android app under Settings → Ads & privacy. Hydrofit.do Web does not show ads.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Your choices</h2>
        <p>
          On Android, manage notifications in system settings, change reminder mode, and erase local
          data with Restore to defaults. On the web, use Settings for the theme, units, reminders,
          and Restore to defaults. HydroFit does not sell personal information.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Children</h2>
        <p>
          HydroFit.do is not directed at children under 13. If a child entered information, remove it
          with Restore to defaults or by uninstalling.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Contact</h2>
        <p>
          Privacy questions can be sent to the developer contact on the Google Play listing for
          com.hydrofitdo.
        </p>
      </article>
    </main>
  );
}

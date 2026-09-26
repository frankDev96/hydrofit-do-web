import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Hydrofit.do Web",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-8">
      <h1 className="text-4xl font-semibold">Terms of Service</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated September 2026</p>
      <article className="mt-6 space-y-4 text-[var(--muted)]">
        <h2 className="text-xl font-semibold text-[var(--text)]">Using HydroFit</h2>
        <p>
          HydroFit.do is a personal lifestyle companion for hydration habits. By using the Android
          app or Hydrofit.do Web you agree to use it for your own tracking on that device or browser.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Not medical advice</h2>
        <p>
          HydroFit does not diagnose, treat, or prevent disease. Daily targets are estimates from
          your weight and schedule. Talk to a qualified clinician about medical or fluid-restriction
          needs.
        </p>
        <h2 className="text-xl font-semibold text-[var(--text)]">Availability</h2>
        <p>
          Features may change as the product evolves. This version does not promise cloud backup or
          sync between the Android app and the website.
        </p>
      </article>
    </main>
  );
}

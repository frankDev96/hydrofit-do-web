"use client";

import { useHydro } from "@/components/hydro-context";
import { deriveSchedule, formatVolume } from "@/lib/hydration";

export default function PlanPage() {
  const hydro = useHydro();
  const slots = deriveSchedule({
    targetMl: hydro.targetMl,
    wakeTime: hydro.state.wakeTime,
    bedTime: hydro.state.bedTime,
    lastIntakeMs: hydro.todayLogs.at(-1)?.loggedAtMs ?? null,
  });

  function exportSchedule() {
    const lines = [
      "Hydrofit.do Web hydration schedule",
      `Daily target: ${hydro.targetMl} ml`,
      `Frequency: ${hydro.portion.frequencyCount} times`,
      `Portion: ${hydro.portion.portionSizeMl} ml`,
      "",
      ...slots.map((slot) => `${slot.timeLabel}  ${slot.title}  ${slot.volumeMl} ml`),
      "",
      "Climate bonuses are not used. The target stays at weight × 33 ml.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hydrofit-schedule.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="px-5 pt-6">
      <h1 className="text-2xl font-semibold">Plan</h1>
      <p className="mt-1 text-sm text-[var(--muted)]">Based on your weight and daily schedule.</p>
      <section className="mt-5 rounded-3xl bg-[var(--primary)] p-5 text-white">
        <p className="text-sm">Target daily intake</p>
        <p className="mt-1 text-4xl font-semibold">{formatVolume(hydro.targetMl, hydro.state.volumeUnit)}</p>
      </section>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--faint)]">Frequency</p>
          <p className="mt-1 text-2xl font-semibold">{hydro.portion.frequencyCount}x</p>
          <p className="text-sm text-[var(--muted)]">Glasses per day</p>
        </article>
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-xs text-[var(--faint)]">Portion size</p>
          <p className="mt-1 text-2xl font-semibold">{formatVolume(hydro.portion.portionSizeMl, hydro.state.volumeUnit)}</p>
          <p className="text-sm text-[var(--muted)]">Per intake interval</p>
        </article>
      </div>
      <h2 className="mt-6 text-sm font-semibold tracking-wide text-[var(--faint)]">HYDRATION SCHEDULE</h2>
      <ul className="mt-3 space-y-2">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
              slot.isActive ? "border-[var(--primary)] bg-[var(--wash)]" : "border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            <span>
              <span className="block font-semibold">{slot.title}</span>
              <span className="text-sm text-[var(--faint)]">{slot.timeLabel}</span>
            </span>
            <span className="font-semibold">{formatVolume(slot.volumeMl, hydro.state.volumeUnit)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Weather-aware targets are not part of this version. Your goal stays at weight × 33 ml.
      </p>
      <button type="button" className="mt-4 h-12 w-full rounded-full border border-[var(--border)] font-semibold" onClick={exportSchedule}>
        Export schedule
      </button>
    </main>
  );
}

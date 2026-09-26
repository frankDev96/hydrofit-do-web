"use client";

import { useMemo, useState } from "react";
import { TIP_CATEGORIES, TIPS, type TipCategory } from "@/lib/content";

export default function TipsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof TIP_CATEGORIES)[number]>("All");
  const tips = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return TIPS.filter((tip) => {
      const categoryOk = category === "All" || tip.category === (category as TipCategory);
      const text = `${tip.title} ${tip.description}`.toLowerCase();
      return categoryOk && (needle.length === 0 || text.includes(needle));
    });
  }, [category, query]);
  const featured = tips[0];

  return (
    <main className="px-5 pt-6">
      <h1 className="text-2xl font-semibold">Hydration tips</h1>
      <input
        aria-label="Search tips"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tips..."
        className="mt-4 h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4"
      />
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {TIP_CATEGORIES.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
              item === category ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {featured ? (
        <article className="mt-4 rounded-3xl bg-[var(--primary)] p-5 text-white">
          <p className="text-xs font-semibold tracking-wide">TIP OF THE DAY</p>
          <h2 className="mt-2 text-2xl font-semibold">{featured.title}</h2>
          <p className="mt-2 text-white/90">{featured.description}</p>
        </article>
      ) : (
        <p className="mt-6 text-sm text-[var(--muted)]">No tips found matching your search.</p>
      )}
      <ul className="mt-4 space-y-3 pb-4">
        {tips.slice(1).map((tip) => (
          <li key={tip.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-semibold text-[var(--primary)]">{tip.category}</p>
            <h2 className="mt-1 font-semibold">{tip.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{tip.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

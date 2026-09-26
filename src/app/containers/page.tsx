'use client';

import Link from 'next/link';
import { useState } from 'react';
import { containerChoices, useHydro } from '@/components/hydro-context';
import { formatVolume, snapCustomSize } from '@/lib/hydration';

export default function ContainersPage() {
    const hydro = useHydro();
    const [custom, setCustom] = useState(250);
    const [asDefault, setAsDefault] = useState(true);
    const choices = containerChoices(hydro.state.customContainers);

    return (
        <main className="px-5 pt-6">
            <Link href="/" className="text-sm font-semibold text-[var(--primary-deep)]">
                Back to today
            </Link>
            <h1 className="mt-3 text-2xl font-semibold">Select container</h1>
            <p className="mt-1 text-sm text-[var(--faint)]">CHOOSE YOUR VESSEL</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
                {choices.map(item => {
                    const selected = item.amountMl === hydro.state.selectedContainerMl;
                    return (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => hydro.setSelectedContainer(item.amountMl)}
                                className={`h-28 w-full rounded-3xl border text-left p-4 ${
                                    selected
                                        ? 'border-[var(--primary)] bg-[var(--wash)]'
                                        : 'border-[var(--border)] bg-[var(--surface)]'
                                }`}
                            >
                                <span className="block font-semibold">{item.name}</span>
                                <span className="text-sm text-[var(--muted)]">
                                    {formatVolume(item.amountMl, hydro.state.volumeUnit)}
                                </span>
                            </button>
                            {item.name === 'Custom' ? (
                                <button
                                    type="button"
                                    className="mt-1 text-xs text-[var(--faint)]"
                                    onClick={() => hydro.removeCustomContainer(item.id)}
                                >
                                    Delete {formatVolume(item.amountMl, hydro.state.volumeUnit)}
                                </button>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
            <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h2 className="font-semibold">Custom size</h2>
                <p className="text-sm text-[var(--muted)]">{custom} ml · 100 to 500 in steps of 50</p>
                <input
                    aria-label="Cup size"
                    type="range"
                    min={100}
                    max={500}
                    step={50}
                    value={custom}
                    onChange={event => setCustom(snapCustomSize(Number(event.target.value)))}
                    className="mt-3 w-full"
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={asDefault} onChange={event => setAsDefault(event.target.checked)} />
                    Set as default for one-tap logs
                </label>
                <button
                    type="button"
                    className="mt-3 h-11 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                    onClick={() => {
                        hydro.addCustomContainer(custom);
                        if (!asDefault) {
                            hydro.setSelectedContainer(hydro.state.selectedContainerMl);
                        }
                    }}
                >
                    Confirm custom size
                </button>
            </section>
        </main>
    );
}

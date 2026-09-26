'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { HomeTabIcon, PlanTabIcon, ProfileTabIcon, StatsTabIcon } from '@/common/icons';
import { ACHIEVEMENTS } from '@/lib/hydration';
import { useHydro } from '@/components/hydro-context';
import { Colors } from '@theme';

const TABS = [
    { href: '/', label: 'Home', Icon: HomeTabIcon },
    { href: '/stats', label: 'Stats', Icon: StatsTabIcon },
    { href: '/plan', label: 'Plan', Icon: PlanTabIcon },
    { href: '/profile', label: 'Profile', Icon: ProfileTabIcon },
] as const;

const LEGAL_PATHS = ['/privacy', '/terms', '/help'];

function normalizePath(pathname: string): string {
    if (pathname.length > 1 && pathname.endsWith('/')) {
        return pathname.slice(0, -1);
    }
    return pathname;
}

export function AppShell({ children }: { children: ReactNode }) {
    const { ready, state, celebration, dismissCelebration } = useHydro();
    const pathname = normalizePath(usePathname());
    const router = useRouter();
    const legal = LEGAL_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
    const showingSetup = !state.onboardingCompleted && (pathname === '/' || pathname === '/onboarding');
    const bare = showingSetup || legal;

    useEffect(() => {
        if (!ready || legal || state.onboardingCompleted) return;
        if (pathname !== '/' && pathname !== '/onboarding') {
            router.replace('/');
        }
    }, [legal, pathname, ready, router, state.onboardingCompleted]);

    if (!ready) {
        return <div className="grid min-h-full place-items-center text-sm text-[var(--faint)]">Hydrofit.do Web</div>;
    }

    return (
        <div className="mx-auto flex min-h-full w-full max-w-lg flex-col">
            <div className={bare ? 'flex-1' : 'flex-1 pb-24'}>{children}</div>
            {celebration ? (
                <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-6">
                    <div className="w-full max-w-sm rounded-3xl bg-[var(--surface)] p-6 text-center shadow-xl">
                        <p className="text-xs font-semibold tracking-wide text-[var(--primary)]">
                            ACHIEVEMENT UNLOCKED
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold">{ACHIEVEMENTS[celebration].title}</h2>
                        <p className="mt-2 text-[var(--muted)]">{ACHIEVEMENTS[celebration].description}</p>
                        <button
                            type="button"
                            className="mt-5 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                            onClick={dismissCelebration}
                        >
                            Awesome
                        </button>
                    </div>
                </div>
            ) : null}
            {!bare && state.onboardingCompleted ? (
                <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--border)] bg-[var(--surface)]">
                    <div className="mx-auto grid max-w-lg grid-cols-4">
                        {TABS.map(tab => {
                            const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
                            const color = active ? Colors.primary : Colors.textMuted;
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold"
                                    style={{ color }}
                                >
                                    <tab.Icon size={22} color={color} filled={active} />
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            ) : null}
        </div>
    );
}

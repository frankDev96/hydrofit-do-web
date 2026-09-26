export function ProgressRing({ progress, label, sublabel }: { progress: number; label: string; sublabel: string }) {
    const clamped = Math.max(0, Math.min(progress, 1));
    const radius = 78;
    const circumference = 2 * Math.PI * radius;
    const dash = circumference * clamped;

    return (
        <div className="relative mx-auto grid h-56 w-56 place-items-center">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden>
                <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--border)" strokeWidth="14" />
                <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference}`}
                />
            </svg>
            <div className="absolute text-center">
                <p className="text-3xl font-semibold tracking-tight">{label}</p>
                <p className="text-sm text-[var(--muted)]">{sublabel}</p>
            </div>
        </div>
    );
}

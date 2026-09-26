'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useHydro } from '@/components/hydro-context';
import {
    dailyTargetMl,
    derivePortionPlan,
    formatTimeLabel,
    formatVolume,
    formatWeight,
    isBedAfterWake,
    kgToLbs,
    lbsToKg,
    type Gender,
    type WeightUnit,
} from '@/lib/hydration';

type Step = 'welcome' | 'gender' | 'weight' | 'wake' | 'bed' | 'plan';

export default function OnboardingPage() {
    const hydro = useHydro();
    const router = useRouter();

    useEffect(() => {
        if (!hydro.ready || !hydro.state.onboardingCompleted) return;
        router.replace('/');
    }, [hydro.ready, hydro.state.onboardingCompleted, router]);

    if (!hydro.ready || hydro.state.onboardingCompleted) {
        return null;
    }

    return <OnboardingScreen />;
}

export function OnboardingScreen() {
    const hydro = useHydro();
    const [step, setStep] = useState<Step>('welcome');
    const [gender, setGender] = useState<Gender | null>(hydro.state.gender);
    const [unit, setUnit] = useState<WeightUnit>(hydro.state.weightUnit);
    const [weightInput, setWeightInput] = useState(
        String(unit === 'lbs' ? Math.round(kgToLbs(hydro.state.weightKg)) : Math.round(hydro.state.weightKg)),
    );
    const [wakeTime, setWakeTime] = useState(hydro.state.wakeTime);
    const [bedTime, setBedTime] = useState(hydro.state.bedTime);
    const [slide, setSlide] = useState(0);
    const [calculating, setCalculating] = useState(false);

    const weightKg = useMemo(() => {
        const value = Number(weightInput);
        if (!Number.isFinite(value) || value <= 0) return hydro.state.weightKg;
        return unit === 'lbs' ? lbsToKg(value) : value;
    }, [hydro.state.weightKg, unit, weightInput]);

    const target = dailyTargetMl(weightKg);
    const portion = derivePortionPlan(target, wakeTime, bedTime);
    const bedOk = isBedAfterWake(wakeTime, bedTime);

    function finish() {
        if (!gender) return;
        hydro.completeOnboarding({
            gender,
            weightKg,
            weightUnit: unit,
            wakeTime,
            bedTime,
        });
    }

    return (
        <main className="px-5 py-8">
            <p className="text-sm font-semibold text-[var(--primary)]">Hydrofit.do Web</p>
            {step === 'welcome' ? (
                <section className="mt-8">
                    <h1 className="text-4xl font-semibold leading-tight">
                        Hi, I&apos;m your personal <span className="text-[var(--primary)]">hydration companion</span>
                    </h1>
                    <p className="mt-4 text-[var(--muted)]">
                        A few details build a daily water target from your weight. Logs stay in this browser.
                    </p>
                    <p className="mt-6 text-xs font-semibold tracking-wide text-[var(--faint)]">
                        AND I&apos;LL KEEP THIS A SECRET.
                    </p>
                    <button
                        type="button"
                        className="mt-8 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                        onClick={() => setStep('gender')}
                    >
                        Let&apos;s go
                    </button>
                    <p className="mt-4 text-center text-sm text-[var(--faint)]">
                        By proceeding, you agree to the{' '}
                        <Link className="text-[var(--primary-deep)]" href="/privacy">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </section>
            ) : null}

            {step === 'gender' ? (
                <section className="mt-8">
                    <h1 className="text-3xl font-semibold">Select your gender</h1>
                    <p className="mt-2 text-[var(--muted)]">Used for your avatar. The daily target uses your weight.</p>
                    <div className="mt-6 grid gap-3">
                        {(
                            [
                                ['male', '/assets/images/male.png'],
                                ['female', '/assets/images/female.png'],
                                ['other', '/assets/images/nogender.png'],
                            ] as const
                        ).map(([option, src]) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setGender(option)}
                                className={`flex h-16 items-center gap-3 rounded-2xl border px-4 font-semibold capitalize ${
                                    gender === option
                                        ? 'border-[var(--primary)] bg-[var(--wash)]'
                                        : 'border-[var(--border)] bg-[var(--surface)]'
                                }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="" className="h-10 w-10 object-contain" />
                                {option}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        disabled={!gender}
                        className="mt-6 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white disabled:opacity-40"
                        onClick={() => setStep('weight')}
                    >
                        Continue
                    </button>
                </section>
            ) : null}

            {step === 'weight' ? (
                <section className="mt-8">
                    <h1 className="text-3xl font-semibold">Your weight</h1>
                    <p className="mt-2 text-[var(--muted)]">
                        Daily target is weight × 33 ml, rounded to the nearest 10 ml.
                    </p>
                    <div className="mt-4 flex gap-2">
                        {(['kg', 'lbs'] as const).map(option => (
                            <button
                                key={option}
                                type="button"
                                className={`rounded-full px-4 py-2 text-sm font-semibold ${unit === option ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)]'}`}
                                onClick={() => {
                                    const value = Number(weightInput);
                                    if (Number.isFinite(value) && value > 0) {
                                        const kg = unit === 'lbs' ? lbsToKg(value) : value;
                                        setWeightInput(String(Math.round(option === 'lbs' ? kgToLbs(kg) : kg)));
                                    }
                                    setUnit(option);
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <input
                        aria-label="Weight"
                        inputMode="decimal"
                        value={weightInput}
                        onChange={event => setWeightInput(event.target.value)}
                        className="mt-4 h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-2xl"
                    />
                    <p className="mt-3 text-sm text-[var(--muted)]">Target {formatVolume(target, 'ml')}</p>
                    <button
                        type="button"
                        className="mt-6 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                        onClick={() => setStep('wake')}
                    >
                        Continue
                    </button>
                </section>
            ) : null}

            {step === 'wake' || step === 'bed' ? (
                <section className="mt-8">
                    <h1 className="text-3xl font-semibold">{step === 'wake' ? 'Wake-up time' : 'Bedtime'}</h1>
                    <p className="mt-2 text-[var(--muted)]">Reminders stay inside this window.</p>
                    <input
                        aria-label={step === 'wake' ? 'Wake time' : 'Bedtime'}
                        type="time"
                        value={step === 'wake' ? wakeTime : bedTime}
                        onChange={event =>
                            step === 'wake' ? setWakeTime(event.target.value) : setBedTime(event.target.value)
                        }
                        className="mt-6 h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-2xl"
                    />
                    {step === 'bed' && !bedOk ? (
                        <p className="mt-3 text-sm text-[var(--primary-deep)]">
                            Bedtime should be later than wake time on the same day.
                        </p>
                    ) : null}
                    <button
                        type="button"
                        className="mt-6 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white disabled:opacity-40"
                        disabled={calculating || (step === 'bed' && !bedOk)}
                        onClick={() => {
                            if (step === 'wake') {
                                setStep('bed');
                                return;
                            }
                            setCalculating(true);
                            window.setTimeout(() => {
                                setCalculating(false);
                                setStep('plan');
                            }, 1200);
                        }}
                    >
                        {calculating ? 'Building your plan…' : 'Continue'}
                    </button>
                </section>
            ) : null}

            {step === 'plan' ? (
                <section className="mt-8">
                    <p className="text-sm text-[var(--faint)]">Personal hydration plan · {slide + 1}/4</p>
                    {slide === 0 ? (
                        <>
                            <h1 className="mt-3 text-3xl font-semibold">{formatVolume(target, 'ml')}</h1>
                            <p className="mt-2 text-[var(--muted)]">
                                Your daily target from {formatWeight(weightKg, unit)}.
                            </p>
                        </>
                    ) : null}
                    {slide === 1 ? (
                        <>
                            <h1 className="mt-3 text-3xl font-semibold">How much should you drink</h1>
                            <p className="mt-2 text-[var(--muted)]">
                                {portion.frequencyCount} times a day, about {portion.portionSizeMl} ml each time.
                            </p>
                        </>
                    ) : null}
                    {slide === 2 ? (
                        <>
                            <h1 className="mt-3 text-3xl font-semibold">What is the right time</h1>
                            <p className="mt-2 text-[var(--muted)]">
                                Reminders run from {formatTimeLabel(wakeTime)} to {formatTimeLabel(bedTime)} while this
                                tab is open.
                            </p>
                        </>
                    ) : null}
                    {slide === 3 ? (
                        <>
                            <h1 className="mt-3 text-3xl font-semibold">How to effectively monitor</h1>
                            <p className="mt-2 text-[var(--muted)]">
                                Check Stats for your streak, weekly average, and goal days.
                            </p>
                        </>
                    ) : null}
                    <button
                        type="button"
                        className="mt-8 h-12 w-full rounded-full bg-[var(--primary)] font-semibold text-white"
                        onClick={() => (slide < 3 ? setSlide(slide + 1) : finish())}
                    >
                        {slide < 3 ? 'Next' : 'Start'}
                    </button>
                    {slide < 3 ? (
                        <button type="button" className="mt-3 w-full text-sm text-[var(--faint)]" onClick={finish}>
                            Skip
                        </button>
                    ) : null}
                </section>
            ) : null}
        </main>
    );
}

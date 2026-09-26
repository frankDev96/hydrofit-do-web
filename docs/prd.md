# Product Requirement Document (PRD) — MVP 1 Focus

## Project: HydroFit.do (React Native Android Application)

---

### 1. Executive Summary & Core Navigation Blueprint

**HydroFit.do** is built on the core principle that **"Small habits lead to big changes."** MVP 1 focuses strictly on onboarding and complete hydration tracking across three primary tabs: **Home**, **History**, and **Settings**.

The goal of MVP 1 is to capture personalized biometric indicators during an intentional intro setup flow, dynamically compute a user's daily hydration target using the fitness formula (`weightKg × 33 ml`), guide the user through a 4-step personalized hydration plan walkthrough, and establish local background notification loops to ensure compliance.

The app leverages Android's background architecture to guide users seamlessly through their fitness and productivity routines without requiring constant manual app-hopping.

#### 1.1 Core Navigation Structure (MVP 1 Tabs)

| Tab | Screen / Destination | Scope & Key Functionality |
|---|---|---|
| **Home** | `TodayScreen` / `HomeScreen` | Circular hydration tracker HUD, live intake vs daily target, quick-log volume pill buttons, next reminder indicator. |
| **History** | `HistoryScreen` | Daily, weekly, and monthly hydration intake timeline logs, achievement trends, and completion analytics. |
| **Settings** | `SettingsScreen` | Personal biometric profile adjustments (weight, unit), reminder intervals and window (wake/bed times), sound and haptic notification preferences. |

#### 1.2 Implementation Status (as of August 2026)

| Area | Status | Notes |
|------|--------|-------|
| React Native scaffold (Epic 1) | **Done** | RN 0.81.5, New Architecture, TypeScript strict, Vitest, Husky pre-commit |
| Biometric Onboarding (Epic 2) | **Done** | Welcome + 4-step form (Gender, Weight, Wake, Bedtime) + Calculation screen |
| Plan Walkthrough Carousel (Epic 2.1) | **Done** | 4-step walkthrough: Intake Target, Portion Breakdown, Reminder Intro, Analytics Intro |
| Today / hydration tracker (Epic 3) | **Done** | Skia ring, quick-log, MMKV intake, Notifee reminders |
| Bottom tab navigator (Home, History, Settings) | **In Progress** | 3-tab layout for MVP 1 hydration hub |
| SQLite `hydration_logs` repository | **Not started** | Intake persisted to MMKV only; `@op-engineering/op-sqlite` installed |
| Task Manager (Module B) | **Phase 2** | — |
| Workout Tracker (Module C) | **Phase 2** | — |
| Calendar & Analytics (Module D) | **Phase 2** | — |
| Weather-aware / location climate | **Deferred (post-MVP)** | Not in MVP 1. See §2.1.3 and brainstorm IDEA “Weather-aware targets”. |

---

### 2. Core Functional Modules

#### 2.1. Module A: Hydration Scheduler & Tracker *(MVP 1 — implemented)*

##### 2.1.1. Onboarding & Walkthrough Flow Architecture

The onboarding funnel consists of two distinct stages:
1. **Biometric Input & Computation:** Inputs captured to compute personal baseline hydration needs.
2. **Personal Hydration Plan Walkthrough (4-Step Carousel):** A sequential presentation communicating the user's plan breakdown, portion distribution, reminder schedule, and progress tracking prior to landing on the Today screen.

| Stage | Screen | Implementation | Key Behaviour & UI Blueprint |
|---|---|---|---|
| **Input** | **1. Welcome** | `WelcomeScreen` | Animated glow + water-drop icon; companion copy; **LET'S GO** → form pager. |
| **Input** | **2. Gender** | `GenderSelectScreen` | Male / Female illustrated cards; forward disabled until selected. |
| **Input** | **3. Weight** | `WeightPickerScreen` | Dual-unit drum picker (`kg` / `lbs`); live target recalculation on change. |
| **Input** | **4. Wake time** | `WakeTimePickerScreen` | `HH:MM` drum + sunrise avatar illustration (default `07:00`). |
| **Input** | **5. Bedtime** | `BedTimePickerScreen` | `HH:MM` drum + sleeping avatar (default `22:00`); warning if `bedTime ≤ wakeTime`. |
| **Engine** | **6. Calculation** | `HydrationCalculationScreen` | Animated liquid waves / 2 s SVG progress ring; *"Generating your hydration plan..."*; auto-advances. |
| **Plan 1/4**| **7. Daily Target** | `HydrationTargetScreen` | Top avatar badge (`Personal hydration plan`), **Skip** button; centerpiece displaying computed target (e.g., `2210 ml`); **NEXT >** / indicator `1/4`. |
| **Plan 2/4**| **8. Portion Breakdown**| `HydrationPortionScreen` | Glass graphic with time badge (e.g., `×11`, `201ml`); headline *"How much should you drink"*; subtext `"{count} times a day / {portion}ml each time"`; **NEXT >** / indicator `2/4`. |
| **Plan 3/4**| **9. Reminder Intro** | `HydrationReminderIntroScreen`| Glass graphic with alarm bubble; headline *"What is the right time"*; subtext *"Don't worry I'll remind you on time"*; **NEXT >** / indicator `3/4`. |
| **Plan 4/4**| **10. Analytics Intro**| `HydrationMonitorIntroScreen` | Upward growth trend line and bar chart graphic; headline *"How to effectively monitor"*; subtext *"Check your hydration report and see your ratio"*; full-width **START** button → completes onboarding & persists. |

---

##### 2.1.2. State & Mathematical Formulations

**Persisted state (`useOnboardingStore` → MMKV on completion):**

```typescript
type OnboardingState = {
  gender: 'male' | 'female' | 'other' | null;
  weightKg: number;
  weightUnit: 'kg' | 'lbs';
  wakeTime: string;       // 'HH:MM' 24h
  bedTime: string;        // 'HH:MM' 24h
  dailyTargetMl: number;
  frequencyCount: number; // e.g., 11 times a day
  portionSizeMl: number;  // e.g., 201 ml each time
  isOnboardingCompleted: boolean;
};
```

Daily target in MVP 1 is `weightKg × 33 ml` (rounded to nearest 10 ml). Home, Plan, and reminders use that base value only.

##### 2.1.3. Deferred — Weather-aware targets (not MVP 1)

Weather-aware hydration targets are a **post-MVP** idea, not a live product requirement. See [_bmad-output/planning-artifacts/brainstorm-hydrofit.md](../_bmad-output/planning-artifacts/brainstorm-hydrofit.md) (`Weather-aware targets`).

MVP 1 does **not** request location permission or read GPS. The in-app Privacy Policy therefore omits any location / climate section until this feature ships.

Out of scope for MVP 1:

- Optional location permission and GPS
- Open-Meteo (or similar) temperature / elevation fetch
- Home climate chip and heat / elevation bonus on the daily target
- Settings or Profile rows that manage location for climate
- Privacy Policy “Location and climate” copy (keep off-screen until location is live)

When weather-aware targets are implemented, restore a Privacy Policy section (en):

- **Heading:** Location and climate
- **Body:** HydroFit may use your optional location (or a city you choose) only to estimate local temperature and elevation for a hydration bonus. Location is not required to log water or receive reminders. You can turn climate off and revoke location permission in system settings. Daily water targets still start from weight × 33 ml.
- **Code:** add `settings.privacyLocationHeading` / `settings.privacyLocationBody` in all locales and include the section in `privacyPolicySections()`.

MVP 1 remains offline-first: logging water, reminders, and the `weightKg × 33 ml` target do not depend on location.
# HydroFit.do — Project Knowledge

## Project Overview

**HydroFit.do** is a React Native Android application that combines hydration tracking, task management, home workouts, and analytics into a single unified lifestyle hub.

**Core Philosophy:** "Small habits lead to big changes."

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | React Native (New Architecture) | TurboModules + Fabric Renderer |
| Language | TypeScript | Strict mode |
| State Management | Zustand | With MMKV persist middleware |
| Fast KV Storage | MMKV | For app state, user prefs, alarm IDs |
| Relational DB | SQLite (`react-native-quick-sqlite`) | Repository pattern for swap-ability |
| Background Tasks | Android AlarmManager | `setExactAndAllowWhileIdle` |
| Target Platform | Android (API 26+) | iOS is future consideration |

## Architecture Decisions (ADRs)

### ADR-001: Repository Pattern for Database

- **Decision:** All database access goes through `src/data/repositories/` interfaces
- **Rationale:** Enables SQLite → WatermelonDB migration without touching business logic
- **Status:** Accepted

### ADR-002: Zustand + MMKV Persistence

- **Decision:** All Zustand stores use `persist` middleware backed by MMKV
- **Rationale:** Sub-millisecond reads via JSI, survives app restarts without custom serialization
- **Status:** Accepted

### ADR-003: AlarmManager Permission Strategy

- **Decision:** Request `SCHEDULE_EXACT_ALARM` during onboarding with full explanation screen; fallback to inexact repeating if denied
- **Rationale:** Android 12+ requires runtime permission; graceful degradation avoids app being unusable
- **Status:** Accepted

### ADR-004: Static Coach Tips for v1.0

- **Decision:** Tips are bundled strings, not fetched remotely
- **Rationale:** Full offline-first architecture; remote config can be added in v1.1 for A/B testing
- **Status:** Accepted

## Module Summary

### Module A — Hydration Tracker

- Custom schedule: start time, end time, interval (30/60/90/120 min), day-of-week matrix
- Quick-log: 250ml / 500ml / 750ml / custom + fluid tag
- AlarmManager background dispatch
- Daily goal tracking with circular progress ring

### Module B — Task Manager

- Category accordion (Abs, Cardio, Work, Personal, Custom)
- Priority matrix (Low / Medium / High)
- Swipe-to-action (Edit / Reschedule / Delete)
- FAB quick-add modal

### Module C — Workout Tracker

- Focus areas: Full Body, Abs, Chest, Arms, Leg, Back
- 10 pre-set zero-equipment exercises
- Random Exercise picker (uncompleted only)
- Rep counter with PAUSE/RESUME/DONE states
- 4-Week tiered training plans (Beginner / Intermediate / Advanced)

### Module D — Calendar & Analytics

- Monthly/weekly habit calendar (Blue = hydration, Green = tasks, Red = workout)
- Hydration time-series chart
- Biometrics log (weight, calories)
- Streak counter
- Coach Tips component

## Navigation Structure

```
Bottom Tab Navigator
├── Tab 1: TODAY    (Dashboard — hydration ring, workout summary, streak)
├── Tab 2: TO-DO    (Task board — accordion list, FAB)
├── Tab 3: WORKOUT  (Exercise library, training plans, live counter)
└── Tab 4: CALENDAR (Monthly grid, analytics charts, biometrics)
```

## Data Models

```typescript
interface Task {
  id: string;
  title: string;
  categoryId: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: number;
}

interface HydrationLog {
  id: string;
  timestamp: number;
  volumeMl: number;
  tag: string; // 'Water' | 'Electrolytes' | 'Tea' | 'Coffee' | 'Other'
}

interface Exercise {
  id: string;
  name: string;
  tagCategory: string;
  targetReps: number;
  isCompletedToday: boolean;
}

interface UserBiometrics {
  timestamp: number;
  weightKg: number;
  caloriesBurned?: number;
}

interface HydrationSchedule {
  id: string;
  startTime: string;   // 'HH:mm'
  endTime: string;     // 'HH:mm'
  intervalMins: 30 | 60 | 90 | 120;
  activeDays: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  goalVolumeMl: number;
}

interface WorkoutSession {
  id: string;
  date: string;          // 'YYYY-MM-DD'
  focusArea: string;
  exercisesCompleted: string[]; // exercise IDs
  durationMins: number;
}

interface DailyStreak {
  date: string;
  hydrationMet: boolean;
  tasksCompleted: boolean;
  workoutLogged: boolean;
}
```

## Design Tokens

```typescript
const Colors = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceElevated: '#2A2A2A',
  primary: '#0077ff',      // Cobalt Blue — Hydration
  accentCyan: '#00D4FF',   // Electric Cyan — Workout
  accentOrange: '#FF5722', // Sunset Orange — Active states
  success: '#28A745',      // Kelly Green — Task completion
  text: '#FFFFFF',
  textSecondary: '#9E9E9E',
  border: '#333333',
};

const Typography = {
  titleLarge: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter' },
  titleMedium: { fontSize: 18, fontWeight: '600', fontFamily: 'Inter' },
  body: { fontSize: 14, fontWeight: '400', fontFamily: 'Inter' },
  caption: { fontSize: 12, fontWeight: '400', fontFamily: 'Inter' },
};
```

## Recommended Zustand Store Structure

```
src/stores/
├── useHydrationStore.ts   — schedule config, today's logs, daily goal, progress %
├── useTaskStore.ts        — tasks[], categories[], active filters
├── useWorkoutStore.ts     — exercises[], activeSession, trainingPlan, currentDay
├── useAnalyticsStore.ts   — streaks, biometrics[], calendar day states
└── useAppStore.ts         — onboarding complete, theme, notification permission
```

## Key Constraints

1. **Offline-first** — All features must work without internet connection
2. **Android 12+ exact alarm** — Must handle `SCHEDULE_EXACT_ALARM` permission gracefully
3. **New Architecture only** — No bridge-based modules; all native code via JSI/TurboModules
4. **Battery efficiency** — AlarmManager triggers must be minimal; no background polling
5. **No cloud dependency for MVP** — All data is local; sync is a future feature

## Brainstorming Artifacts

- Full brainstorming session: `_bmad-output/planning-artifacts/brainstorm-hydrofit.md`
- Product brief: `_bmad-output/planning-artifacts/product-brief.md`
- PRD source: `docs/prd.md`

## Planning Artifacts Location

- `_bmad-output/planning-artifacts/` — PRD, briefs, architecture docs, epics
- `_bmad-output/implementation-artifacts/` — Stories, technical specs, test plans
- `docs/` — Project knowledge (this file and other reference docs)

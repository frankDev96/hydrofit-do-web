# SOLID in HydroFit.do

Source: Robert C. Martin, *Agile Software Development, Principles, Patterns, and Practices* (the SOLID set). Applied here to React Native + TypeScript, not Java class hierarchies.

Do not add extra classes to "look SOLID." Apply a principle when it prevents a real coupling or a second reason to change.

## S — Single Responsibility

A module has one reason to change.

| Layer | Owns | Must not own |
|-------|------|----------------|
| Screen | Composition, navigation, wiring props | SQL, MMKV, Notifee, formulas |
| Component | Rendering from props | Fetching, persistence, global store writes (unless it is the store's UI adapter) |
| Store | Module state + commands | Rendering, Android APIs |
| Repository | Persistence | UI, notification side effects |
| `utils/` | Pure functions | React, I/O |
| `core/` service | One cross-cutting system (alarms, lifecycle) | Feature UI |

**Smell:** `PlanScreen` computing targets, writing MMKV, and scheduling alarms.

**Fix:** screen calls `derivePortionPlan` + store setters; `NotificationService` is the only Notifee owner.

## O — Open/Closed

Open for extension, closed for modification.

- New timeframe / variant → add data or a small mapper, not a copied component with hardcoded labels.
- New visual emphasis → token or variant prop, not a one-off hex in the caller.
- New persistence → new repository implementation behind the existing interface.

**Smell:** `if (timeframe === 'Week') { color: '#0077ff' } else { color: '#FF5722' }` in a chart.

**Fix:** map timeframe → `Colors.*` (or a token map) outside the renderer.

## L — Liskov Substitution

Substitutable implementations must honor the interface.

- A repository mock in tests must obey the same success/empty/error shape as the real one.
- A store rehydrate path must leave the same fields a first-run path leaves (`intakeByDate` always an object).
- Do not implement "half" of an interface and hope callers check.

**Smell:** production `getByDate` returns `[]` for missing days; test mock returns `undefined`.

## I — Interface Segregation

Many small contracts beat one fat one.

- Component props list only what that component renders (`targetMl`, not the whole onboarding store).
- Do not pass `navigation`, `store`, or `route` into a presentational card "for later."
- Hooks/selectors pull the minimum slice: `useHydrationStore(s => s.intakeByDate)` (or destructure only used fields).

**Smell:** `<StatsSummaryCard store={useHydrationStore()} />`.

## D — Dependency Inversion

High-level policy depends on abstractions, not on MMKV / SQLite / Notifee.

```
Screen → store interface / pure utils
Store → repository interface
Repository → SQLite / MMKV
core/NotificationService → Notifee   (only this file)
```

- Screens import `@stores`, `@theme`, `@common/*`, module utils. They do not import `react-native-mmkv` or `@notifee/react-native`.
- Feature modules do not import sibling modules (AD-1). Shared behavior goes through `core/`.

**Smell:** `new MMKV().set('x', n)` inside `HomeScreen`.

## When not to apply

A 20-line pure formatter does not need an interface, factory, and three files. SOLID is for **change isolation**, not file count. If splitting would not make a future edit safer, do not split.

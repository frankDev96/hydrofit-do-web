# Industry standards (this repo)

These are the rules we actually enforce. Each item is grounded in a current, primary source — not blog folklore.

## TypeScript

**Sources:** [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html); TypeScript Handbook (`strict`); LogRocket / enterprise TS practice (strict as CI gate).

| Rule | Why it is genuine |
|------|-------------------|
| `"strict": true`, no `any` | Google: `any` masks errors and undoes static typing. Use `unknown` and narrow. |
| No `@ts-ignore` | Google / TS handbook: `@ts-ignore` hides errors that may vanish; `@ts-expect-error` + comment is the only suppression, tests/mocks only. |
| Prefer `interface` for object shapes | Google + TypeScript team guidance: interfaces display and compose more reliably than type aliases for objects. Use `type` for unions, tuples, mapped types. |
| Optional field `x?: T` over `x: T \| undefined` | Google: optional vs explicit undefined are different at construct time. |
| `===` / `!==` | Google: except `== null` when both `null` and `undefined` are intended. |
| No non-null `!` and no casual `as` | Google: assertions skip runtime checks. Narrow instead. |
| Named exports; explicit types on exported functions | Google naming + this repo's existing pattern. |
| Handle index access | Prefer `.at()` / guards. `noUncheckedIndexedAccess` is the industry direction even if this tsconfig has not enabled it yet — still write as if `arr[i]` might be missing. |

Do **not** invent clever mapped types that take minutes to read. Google: clarity over cleverness.

## React Native UI

**Sources:** [React Native StyleSheet](https://reactnative.dev/docs/stylesheet); Expo design-system skill (tokens, no hardcoded hex); W3C Design Tokens / industry token layers (primitive → semantic → component).

| Rule | Why it is genuine |
|------|-------------------|
| `StyleSheet.create()` at module scope | RN docs: moves styles out of render, names them, enables static checking. Creating style objects inside render reallocates every pass. |
| No hardcoded hex / spacing / fontSize in UI | Token systems exist so theme and density can change in one file. Hardcoded values break light/dark parity (`LightColors` / `DarkColors`). |
| Semantic tokens (`Colors.text`) not primitives (`#191C1E`) | Semantic names survive a palette swap; raw hex does not. |
| Typography tokens, never `fontWeight` with Inter | This project's Android font files resolve by family suffix. Pairing `Inter-Bold` with `fontWeight: '700'` drops Inter. |

Allowed exception: a **single** layout number driven by runtime measurement (`onLayout`, scroll offsets). Colors and spacing inside that object still come from tokens.

## Architecture

**Sources:** Clean Architecture / hexagonal (ports and adapters); this repo's Architecture Spine (modular monolith, AD-1).

| Rule | Why it is genuine |
|------|-------------------|
| Repository interfaces for DB | Domain must not depend on SQLite. Swap storage without rewriting screens. |
| One Zustand store per module | Single writer for that module's state; persist via MMKV in the store, not in UI. |
| `core/` owns Notifee, lifecycle, navigation ref | One owner prevents duplicate AlarmManager schedules (AD-5). |
| No cross-module imports | Enforced by ESLint `import/no-restricted-paths`. Shared code → `core/` or `common/`. |

## Testing and quality

| Rule | Why it is genuine |
|------|-------------------|
| Behavior tests at the screen/util boundary | Tests lock the contract SOLID depends on. |
| Fake timers + local dates for calendar logic | Avoids UTC/`toISOString()` day-boundary bugs. |
| `tsc --noEmit` and lint are gates | Industry default: type errors do not ship. |

## Security (mobile)

**Sources:** OWASP MASVS (high level).

- No secrets, API keys, or PII in source or logs.
- Health/hydration data stays on-device (offline-first). Do not add network calls for core features.

## What we reject (common but weak)

- "StyleSheet.create is faster because of bridge IDs" — RN source: `create` is an identity in production; we use it for **structure and typechecking**, not a performance myth.
- SOLID as "more files / more interfaces" — Martin: principles reduce the cost of change. Extra indirection without a second caller is worse.
- Copying hex from Figma into a screen "just this once" — that is how token systems die.

## Adding a standard later

Only add a rule here if you can name a **primary source** (language spec, vendor style guide, official framework docs, or a named architecture text) and a **failure it prevents in this repo**.

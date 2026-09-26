---
name: hydrofit-code-standards
description: >-
  Enforces HydroFit.do coding standards on every source change: colors from
  src/theme/colors.ts, spacing from src/theme/spacing.ts, new shared values
  added to the matching theme file then reused, SOLID, TypeScript strict, and
  React Native StyleSheet. Apply whenever writing, editing, implementing,
  fixing, refactoring, styling, reviewing, or generating any .ts/.tsx code,
  screens, components, stores, or tests.
---

# HydroFit Code Standards

Read this skill **before** writing or editing any code. Do not skip it for "small" UI tweaks.

Authoritative token files (import via `@theme`):

| Kind | File | Import |
|------|------|--------|
| Color | `src/theme/colors.ts` | `Colors` |
| Space / radius | `src/theme/spacing.ts` | `Spacing`, `BorderRadius` |
| Type | `src/theme/typography.ts` | `Typography` |
| Barrel | `src/theme/index.ts` | `@theme` |

## Pre-change gate

Copy and complete before the first edit:

```
- [ ] Searched existing Colors / Spacing / BorderRadius / Typography for a matching token
- [ ] New shared visual value will be added to the matching theme file first, then used
- [ ] LightColors and DarkColors stay in key parity if a color is added
- [ ] No hex, rgb(), raw padding/margin/gap/fontSize in component files
- [ ] Change obeys SOLID (see SOLID.md) and industry rules (see STANDARDS.md)
```

## Design tokens (non-negotiable)

### Color — `src/theme/colors.ts`

- Use `Colors.*` only. Never `'#0077ff'`, `'#fff'`, `'white'`, `'rgba(...)'`, or `Colors.primary + '20'` in screens or components.
- Need a new color? Add the **same key** to `LightColors` and `DarkColors`, name it by **role** (`surfaceMuted`, `errorSoft`), not by hue (`lightBlue2`).
- Prefer an existing semantic key (`textSecondary`, `border`, `primarySoft`) over minting a near-duplicate.

### Space — `src/theme/spacing.ts`

- Use `Spacing.xs | sm | md | lg | xl | xxl | xxxl` for margin, padding, gap.
- Use `BorderRadius.sm | md | lg | full` for corners.
- The scale is a **4dp grid**. Do not hardcode `5`, `13`, `20`, `18` in a `StyleSheet`.
- Need a new step? Add a named key to `Spacing` or `BorderRadius`, then use that key. Off-grid values still belong in the token file, never as a one-off literal in UI.
- `StyleSheet.hairlineWidth` is the only allowed non-token layout constant (platform hairline).

### Type — `src/theme/typography.ts`

- No inline `fontSize`, `fontWeight`, or ad-hoc `fontFamily`.
- Weight lives in the family name (`Inter-Bold`), never `fontWeight: '700'` (Android will drop Inter).
- New text role → add a `Typography.*` entry, then apply it.

### Styles

- `StyleSheet.create()` at module scope. No style objects built inside render.
- No inline `style={{ ... }}` except a **dynamic value** that cannot be a token (e.g. `height` from measured layout). Even then, colors/spacing inside that object still use tokens.
- Import tokens from `@theme`, not deep relative paths.

```tsx
// BAD
padding: 16,
color: '#191C1E',
fontSize: 14,

// GOOD
padding: Spacing.md,
color: Colors.text,
...Typography.body,
```

## SOLID (required)

Map every change to these. Details and examples: [SOLID.md](SOLID.md).

| | Rule in this repo |
|---|-------------------|
| **S** | One reason to change. Screens compose; they do not own persistence, notifications, or formula logic. Pure helpers live in `utils/`. |
| **O** | Extend via props, tokens, or new functions. Do not fork a component with hardcoded special cases. |
| **L** | Implementations honor their interface (repositories, stores). Do not weaken contracts in "temporary" code. |
| **I** | Pass the smallest props a component needs. Do not thread a whole store or screen into a card. |
| **D** | UI depends on store/repository interfaces. Never import MMKV, SQLite, or Notifee from a screen. |

If a change mixes UI, I/O, and business rules in one file, split it before finishing.

## TypeScript and React Native

Must follow [STANDARDS.md](STANDARDS.md). Short form:

- `strict` TypeScript: no `any`, no `as any`, no `@ts-ignore`. Prefer `unknown` + narrowing.
- Prefer `@ts-expect-error` with a reason if a suppression is truly required (tests/mocks only).
- Named exports for components; explicit return types on exported functions.
- Handle `undefined` at the boundary (empty records, missing store fields). No unchecked `array[i].foo`.
- Feature modules must not import each other (AD-1). Shared code goes in `src/core/`, `src/common/`, or `src/theme/`.
- All DB access through repository interfaces. One Zustand store per module.

## New common variable

A value used in **more than one component**, or that represents a **design decision**, is a token:

1. Add it to the matching file (`colors.ts`, `spacing.ts`, `typography.ts`).
2. Export is already covered if you add it to the existing `as const` object.
3. Replace every literal with the token in the same change.
4. If both light and dark exist for that kind of token, update **both**.

Do not leave a "temporary" hex "to clean up later."

## After the change

- Confirm no new hex / raw spacing / raw fontSize in the diff (except inside `src/theme/`).
- Keep Light/Dark color keys aligned.
- Add or update tests when behavior changes.
- Do not expand scope past the request.

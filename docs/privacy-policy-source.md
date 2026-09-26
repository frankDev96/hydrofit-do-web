# HydroFit.do — Privacy Policy Source Brief

**Purpose:** Fact pack for drafting (or updating) a public Privacy Policy / Play Store Data safety form.  
**Sources:** `docs/prd.md`, in-app copy (`src/i18n/locales/en.json`), Android manifest, stores, AdMob/UMP integration.  
**Scope date:** September 2026 (MVP 1 hydration hub as shipped/planned).  
**Not legal advice:** Confirm with counsel before publishing. Fill every `[PLACEHOLDER]` before release.

---

## 1. How to use this document

| Use | Guidance |
|-----|----------|
| Write a hosted Privacy Policy | Follow §12 outline; paste only claims that match §3–§10. |
| Update in-app Privacy Policy | Keep `settings.privacy*` strings aligned with this brief. |
| Google Play Data safety | Map §3 categories → Play Console questionnaire; ads = yes. |
| Future features | Do **not** claim deferred items (§11) until they ship. |

**Product name:** HydroFit.do  
**Package / application ID:** `com.hydrofitdo`  
**Platform (current):** Android (API 26+)  
**Operator / publisher:** `[LEGAL ENTITY NAME]`  
**Privacy contact email:** `[privacy@example.com]`  
**Postal address (if required by jurisdiction):** `[ADDRESS]`  
**Policy effective / last updated date:** `[YYYY-MM-DD]`  
**Public policy URL (Play Store):** `https://frankdev96.github.io/hydrofit-privacy/privacy/`

---

## 2. Product snapshot (privacy-relevant)

HydroFit.do is a **personal lifestyle / hydration companion**. MVP 1 focuses on:

- Onboarding biometrics → daily water target (`weightKg × 33 ml`)
- Logging intake on-device
- Local reminder notifications
- History / stats from local logs
- Optional profile display name + photo
- Google AdMob ads (banner + occasional interstitial) with UMP consent where required

**Core privacy posture (MVP 1):**

- **No user account** — no sign-up, login, or HydroFit user ID.
- **Offline-first for core features** — logging water, reminders, and `weight × 33` target do **not** require a HydroFit backend.
- **No HydroFit cloud** for health/hydration data in this version.
- **Ads need network** — AdMob/UMP are the primary reason the app uses Internet.
- **Does not sell personal information** (stated in current in-app policy).

---

## 3. Data inventory (what exists on device)

Classify for counsel / Play Data safety. “Collected” here means **processed or stored by the app** on the device, whether or not uploaded to HydroFit servers (MVP: generally not).

### 3.1 Profile & biometrics (onboarding / settings)

| Data | Examples | Purpose | Storage | Shared with HydroFit cloud? | Shared with ads? |
|------|----------|---------|---------|-----------------------------|------------------|
| Gender | `male` / `female` / `other` | Avatar fallback, personalization | MMKV | No | No (not sent by HydroFit) |
| Body weight | `weightKg`, unit `kg`/`lbs` | Daily target formula | MMKV | No | No |
| Wake / bed times | `HH:MM` | Reminder window | MMKV | No | No |
| Computed plan | `dailyTargetMl`, `frequencyCount`, `portionSizeMl` | Plan UI + reminders | MMKV | No | No |
| Onboarding flag | `isOnboardingCompleted` | Navigation gate | MMKV | No | No |

**Sensitivity note:** Weight and gender are **health-adjacent personal data**. Treat carefully in policy language (purpose limitation, local storage, no medical use).

### 3.2 Profile presentation

| Data | Examples | Purpose | Storage | Notes |
|------|----------|---------|---------|-------|
| Display name | free text | UI personalization | MMKV (Zustand persist) | Optional |
| Profile photo | local image / data URI from gallery | Avatar | MMKV (+ media permission) | Stays on device; not uploaded by HydroFit |

### 3.3 Hydration activity

| Data | Examples | Purpose | Storage |
|------|----------|---------|---------|
| Intake logs | `id`, `amountMl`, `loggedAtMs` | Progress, history, stats | MMKV (`intakeByDate`) |
| Selected / custom containers | amount ml, custom cup list | Quick-log UX | MMKV |
| Reminder prefs | sound, mode (e.g. vibration) | Notifications | MMKV |
| Tips / achievement progress | tips read, unlocks | Tips & badges UX | MMKV |
| In-app notification inbox | reminder/message history | Inbox UI | MMKV |
| Widget pending logs | amounts from home-screen widget | Merge into today’s intake | Native / MMKV bridge |

**PRD note:** SQLite `hydration_logs` repository is planned; MVP persists intake in **MMKV**. Policy should say “on this device” without locking to a specific DB engine unless required.

### 3.4 App preferences (non-health)

| Data | Purpose |
|------|---------|
| Theme / appearance | UI |
| Language / locale | i18n |
| Weight & volume units | Display |
| Main tab / UI state | Navigation |
| Ad banner dismiss / local ad UX flags | Ad presentation rules |

### 3.5 Device / OS data (permissions & SDKs)

| Data / capability | When | Who uses it |
|-------------------|------|-------------|
| Notification permission | Reminders | App (Notifee / AlarmManager) |
| Exact alarms / boot completed / wake lock | Schedule & reschedule reminders after reboot | App |
| Vibration | Haptic / vibration-only reminders | App |
| Photo library access | User picks profile photo | App (local only) |
| Internet / network state | Load ads, UMP consent | App + Google Mobile Ads |
| Advertising ID / device identifiers | Ad serving, frequency, fraud (per Google) | **Google AdMob** (not HydroFit health sync) |
| Approximate region for consent | UMP may infer need for consent form (e.g. EEA) | **Google UMP** |

HydroFit does **not** implement first-party analytics, crash reporting, or account telemetry in the current codebase.

---

## 4. What HydroFit does **not** do (MVP 1 — claim only if still true)

Do **not** contradict these in the published policy:

1. No HydroFit account or password.
2. No upload of hydration logs, weight, gender, wake/bed times, or profile photo to a HydroFit-operated cloud.
3. No cloud backup / multi-device sync promised.
4. No location / GPS for climate or weather-aware targets (deferred — see §11).
5. No diagnosis, treatment, or medical advice (health disclaimer belongs in Terms; privacy can note targets are estimates).
6. HydroFit does not sell personal information (current product claim).
7. Core hydration features work without creating an account; ads may still use network when allowed.

---

## 5. Purposes of processing (map for policy “Why we use data”)

| Purpose | Data used | Legal-basis hint (counsel to confirm) |
|---------|-----------|----------------------------------------|
| Provide hydration tracking | Intake logs, containers | Contract / legitimate interest / consent depending on region |
| Compute daily target & plan | Weight, schedule-derived fields | Same |
| Send local reminders | Wake/bed, reminder prefs, OS notification permission | Consent for notifications where required |
| Personalize UI | Name, photo, gender avatar, language, theme, units | Same |
| Show ads / fund free app | Device identifiers via Google; **not** HydroFit health payload | Consent (UMP) where required; Google policies |
| Erase / reset | All local keys wiped on “Restore to defaults” | User request |

---

## 6. Storage, retention, security (technical facts)

| Topic | Fact |
|-------|------|
| Primary store | On-device **MMKV** (Zustand persist + onboarding keys) |
| Backup | `android:allowBackup="false"` — Android Auto Backup disabled for the app |
| HydroFit servers | None for MVP health data |
| Retention | Until user clears via **Settings → Restore to defaults**, clears app data, or uninstalls |
| Encryption | Relies on OS / device storage protections; no separate HydroFit cloud encryption story |
| Children | `[STATE AGE POLICY — e.g. not directed at children under 13 / 16]` |

**User deletion path (in-app):** Settings → **Restore to defaults** → cancels notifications, clears MMKV, resets stores, returns user to onboarding Welcome.

---

## 7. Android permissions (disclose accurately)

From `android/app/src/main/AndroidManifest.xml`:

| Permission | Privacy-facing explanation |
|------------|----------------------------|
| `INTERNET` | Ads / consent network calls |
| `ACCESS_NETWORK_STATE` | Know connectivity for ads SDK |
| `POST_NOTIFICATIONS` | Hydration reminders (Android 13+) |
| `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` | Reliable reminder timing |
| `RECEIVE_BOOT_COMPLETED` | Reschedule reminders after reboot |
| `WAKE_LOCK` | Deliver scheduled reminder work |
| `VIBRATE` | Vibration reminder mode |
| `READ_MEDIA_IMAGES` (13+) / `READ_EXTERNAL_STORAGE` (≤12) | Optional profile photo from gallery |

**Not requested in MVP 1:** location / fine or coarse GPS.

---

## 8. Third parties & subprocessors

### 8.1 Google AdMob + User Messaging Platform (UMP)

| Item | Detail |
|------|--------|
| SDK | `react-native-google-mobile-ads` |
| Formats | Adaptive **banner**; **interstitial** on selected triggers |
| Consent | `AdsConsent` / UMP — gather consent before requesting ads where required |
| In-app control | Settings → **Ads & privacy** → Google privacy options / consent form when available |
| What HydroFit sends to ads | Does **not** intentionally pipe hydration logs or biometrics into AdMob requests |
| What Google may collect | Device / advertising identifiers and other data per [Google’s ads & privacy policies](https://policies.google.com/privacy) and AdMob disclosures |
| Ad placement summary (product truth) | Banner above tab bar; dismissible banners on Tips / achievement; interstitial after every 3rd log of the day **or** first daily goal hit; **never** on onboarding or cold launch; logging succeeds even if ad fails |

**Policy must:** name Google as advertising partner; link Google privacy policy; describe consent / “Ads & privacy”; state health logs stay on device.

### 8.2 Other third parties (MVP)

| Party | Role |
|-------|------|
| Device OEM / Google Play services | OS, notifications, possibly Advertising ID framework |
| WhatsApp (package query only) | Manifest `queries` for WhatsApp — `[CONFIRM whether stickers/share uses WhatsApp; disclose if personal data shared]` |

No first-party analytics/crash SDK found in current source.

### 8.3 Future modules (Phase 2 — do not claim as live)

Product brief / PRD Phase 2: tasks, workouts, calendar analytics, possible later sync. When added, **re-open this brief** and update the public policy before shipping.

---

## 9. International / regional notes (for counsel)

| Topic | Product fact | Typical policy implication |
|-------|--------------|----------------------------|
| EEA / UK | UMP consent forms when Google requires them | GDPR/UK GDPR ads consent; disclose controllers |
| “Do Not Sell” | Product claim: does not sell PI | CCPA/CPRA — confirm “share” for ads vs sell |
| Health data | Weight, intake may be “sensitive” in some laws | Limit purpose; emphasize on-device; ads separation |
| Offline-first | Core features local | Still disclose AdMob as network processing |

---

## 10. User controls (copy these into “Your rights / choices”)

1. **System notification permission** — grant/deny Android reminders.
2. **Reminder settings** — sound, vibration-only, or off (in Settings).
3. **Ads & privacy** — Google UMP privacy options / consent where offered.
4. **Profile** — change or clear display name / photo.
5. **Restore to defaults** — erase local HydroFit data and restart onboarding.
6. **Uninstall / clear app storage** — removes remaining on-device data.
7. **Photo permission** — revoke in system settings (profile photo picker only).

**Contact for privacy requests:** `[privacy@example.com]`  
(For MVP with no cloud account, most “access/export/delete” requests are satisfied by on-device controls; still provide an email for questions.)

---

## 11. Deferred / planned features (keep **out** of live policy until shipped)

PRD §2.1.3 — **Weather-aware targets** (post-MVP):

- Optional location or city
- Temperature / elevation fetch (e.g. Open-Meteo)
- Climate bonus on daily target

**Draft section to add later (from PRD):**

> **Location and climate**  
> HydroFit may use your optional location (or a city you choose) only to estimate local temperature and elevation for a hydration bonus. Location is not required to log water or receive reminders. You can turn climate off and revoke location permission in system settings. Daily water targets still start from weight × 33 ml.

Also deferred relative to full product vision: cloud sync, accounts, task/workout modules’ data categories.

---

## 12. Suggested Privacy Policy outline (ready to draft)

Use this structure for the public HTML/Markdown policy. Fill placeholders; keep claims synced with §§3–10.

1. **Introduction** — who we are (`[LEGAL ENTITY]`), what HydroFit.do is, scope (Android app `com.hydrofitdo`).
2. **Summary** — on-device hydration data; no HydroFit account/cloud for health data; ads via Google.
3. **Information we process**
   - Information you provide (biometrics, profile, logs, prefs)
   - Information from your device (permissions, identifiers via ads SDK)
4. **How we use information** — tracking, reminders, personalization, advertising.
5. **How we store information** — on device; retention until reset/uninstall; `allowBackup=false`.
6. **Sharing** — no sale; Google AdMob/UMP as advertising partner; no HydroFit health upload.
7. **Advertising** — AdMob formats, UMP, Settings → Ads & privacy; link Google policies.
8. **Permissions** — table from §7 in plain language.
9. **Your choices and rights** — §10 + regional rights language counsel adds.
10. **Children’s privacy** — `[AGE POLICY]`.
11. **Health disclaimer pointer** — targets are estimates; not medical advice (or cross-link Terms).
12. **International users** — brief.
13. **Changes** — how you notify updates; “Last updated” date.
14. **Contact** — `[privacy@example.com]`, `[ADDRESS]`.

---

## 13. Play Console Data safety — quick mapping aid

| Play category (approx.) | Collected? | Shared? | Notes |
|-------------------------|------------|---------|-------|
| Health info (e.g. weight, fitness activity) | Yes (on device) | No (to HydroFit / not intentionally to ads) | Disclose on-device processing |
| Personal info (name) | Optional | No | Display name |
| Photos | Optional | No | Profile only |
| App activity (in-app actions) | Local logs | No | Hydration logs |
| Device or other IDs | Via AdMob | Yes (with Google) | Advertising |
| Location | No (MVP) | — | Add when climate ships |
| Account info | No | — | No accounts |

Exact Play answers depend on whether Google’s SDK “collection” counts as developer-declared collection — follow current Play guidance + AdMob Data safety help.

---

## 14. Checklist before publishing a policy

- [ ] Fill all `[PLACEHOLDER]` operator/contact fields  
- [ ] Confirm AdMob unit IDs / publisher account ownership  
- [ ] Confirm WhatsApp query purpose and whether any data leaves the device via share/stickers  
- [ ] Align in-app `settings.privacy*` / Ads privacy copy with the hosted policy  
- [ ] Set “Last updated” consistently (in-app currently: September 2026)  
- [ ] Counsel review for GDPR / CCPA / health-data wording  
- [ ] Remove or avoid location/climate language until feature ships  
- [ ] Revisit this brief when SQLite sync, accounts, analytics SDKs, or climate go live  

---

## 15. Source index

| Artifact | Relevance |
|----------|-----------|
| `docs/prd.md` | MVP scope, biometrics, offline-first, deferred location privacy text |
| `_bmad-output/planning-artifacts/product-brief.md` | Broader product vision (Phase 2 modules) |
| `docs/project-knowledge.md` | Offline-first ADR; no cloud for MVP |
| `src/i18n/locales/en.json` | Current in-app Privacy / Ads / Terms / Help copy |
| `src/modules/hydration/screens/settings/settingsArticles.ts` | In-app section structure |
| `src/core/AdService.ts` | UMP + AdMob behavior |
| `src/common/constants/adConfig.ts` | Ad unit configuration |
| `src/stores/*` | What is persisted locally |
| `src/stores/resetAppData.ts` | Deletion / restore behavior |
| `android/app/src/main/AndroidManifest.xml` | Permissions & backup flag |

---

## 16. One-paragraph “truth statement” (starter for counsel)

> HydroFit.do is an Android hydration habit app that stores profile biometrics (such as gender and weight), wake and bed times, water intake logs, reminder preferences, and optional display name and profile photo on the user’s device using local storage. The app does not require an account and, in the current version, does not upload that health or profile data to a HydroFit cloud service. The app displays Google AdMob advertisements and may use Google’s User Messaging Platform for advertising consent; Google may process device identifiers for advertising under Google’s policies. Users can manage notification permissions in system settings, manage ad consent via in-app Ads & privacy where available, and erase local app data with Restore to defaults. Location-based climate features are not part of the current release.

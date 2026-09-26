"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ACHIEVEMENTS,
  CONTAINERS,
  type AchievementId,
  type CustomContainer,
  type Gender,
  type InboxItem,
  type IntakeByDate,
  type IntakeLog,
  type ReminderMode,
  type ThemeMode,
  type VolumeUnit,
  type WeightUnit,
  currentStreak,
  dailyTargetMl,
  dateKey,
  dayTotal,
  deriveLevel,
  derivePortionPlan,
  deriveSchedule,
  formatVolume,
  sumAllMl,
  unlockedAchievements,
} from "@/lib/hydration";

const STORAGE_KEY = "hydrofit-do-web-v1";
const EMPTY_LOGS: IntakeLog[] = [];

export type HydroState = {
  gender: Gender | null;
  weightKg: number;
  weightUnit: WeightUnit;
  volumeUnit: VolumeUnit;
  wakeTime: string;
  bedTime: string;
  onboardingCompleted: boolean;
  onboardingCompletedAtMs: number | null;
  displayName: string;
  photoDataUrl: string | null;
  theme: ThemeMode;
  selectedContainerMl: number;
  customContainers: CustomContainer[];
  intakeByDate: IntakeByDate;
  remindersEnabled: boolean;
  reminderMode: ReminderMode;
  lastReminderKey: string | null;
  inbox: InboxItem[];
};

export const initialState: HydroState = {
  gender: null,
  weightKg: 70,
  weightUnit: "kg",
  volumeUnit: "ml",
  wakeTime: "07:00",
  bedTime: "22:00",
  onboardingCompleted: false,
  onboardingCompletedAtMs: null,
  displayName: "",
  photoDataUrl: null,
  theme: "light",
  selectedContainerMl: 250,
  customContainers: [],
  intakeByDate: {},
  remindersEnabled: true,
  reminderMode: "display",
  lastReminderKey: null,
  inbox: [],
};

type OnboardingDraft = {
  gender: Gender;
  weightKg: number;
  weightUnit: WeightUnit;
  wakeTime: string;
  bedTime: string;
};

type HydroContextValue = {
  ready: boolean;
  state: HydroState;
  targetMl: number;
  todayKey: string;
  todayLogs: IntakeLog[];
  todayMl: number;
  streak: number;
  level: number;
  totalMl: number;
  portion: { frequencyCount: number; portionSizeMl: number };
  nextReminderLabel: string | null;
  celebration: AchievementId | null;
  logIntake: (amountMl: number, loggedAtMs?: number) => void;
  removeLog: (id: string) => void;
  setSelectedContainer: (amountMl: number) => void;
  addCustomContainer: (amountMl: number) => void;
  removeCustomContainer: (id: string) => void;
  completeOnboarding: (draft: OnboardingDraft) => void;
  updateProfile: (patch: { displayName?: string; photoDataUrl?: string | null; gender?: Gender }) => void;
  updateBody: (patch: Partial<Pick<HydroState, "weightKg" | "weightUnit" | "volumeUnit" | "wakeTime" | "bedTime" | "theme" | "remindersEnabled" | "reminderMode">>) => void;
  clearInbox: () => void;
  dismissCelebration: () => void;
  restoreDefaults: () => void;
};

const HydroContext = createContext<HydroContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function loadState(): HydroState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return initialState;
    return { ...initialState, ...parsed, intakeByDate: (parsed.intakeByDate as IntakeByDate) ?? {} };
  } catch {
    return initialState;
  }
}

function playChime() {
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.18);
    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // Some browsers block audio until the page has had a user gesture.
  }
}

let hydrated = false;
let memory = initialState;
const listeners = new Set<() => void>();

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function emit() {
  for (const listener of listeners) listener();
}

function commit(updater: (current: HydroState) => HydroState) {
  const next = updater(memory);
  if (next === memory) return;
  memory = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  applyTheme(memory.theme);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!hydrated) {
    hydrated = true;
    memory = loadState();
    applyTheme(memory.theme);
  }
  return memory;
}

function getServerSnapshot() {
  return initialState;
}

function clientReady() {
  return true;
}

function serverReady() {
  return false;
}

function subscribeReady() {
  return () => undefined;
}

export function HydroProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const [celebration, setCelebration] = useState<AchievementId | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  const targetMl = dailyTargetMl(state.weightKg);
  const todayKey = dateKey(nowMs);
  const todayLogs = state.intakeByDate[todayKey] ?? EMPTY_LOGS;
  const todayMl = dayTotal(todayLogs);
  const lastIntakeMs = todayLogs.at(-1)?.loggedAtMs ?? null;

  const pushInbox = useCallback((title: string, body: string, current: InboxItem[]): InboxItem[] => {
    return [{ id: crypto.randomUUID(), title, body, atMs: Date.now() }, ...current].slice(0, 40);
  }, []);

  const logIntake = useCallback((amountMl: number, loggedAtMs = Date.now()) => {
    if (!Number.isFinite(amountMl) || amountMl <= 0) return;
    const rounded = Math.round(amountMl);
    commit((current) => {
      const key = dateKey(loggedAtMs);
      const target = dailyTargetMl(current.weightKg);
      const beforeIds = unlockedAchievements(current.intakeByDate, target);
      const previousToday = dayTotal(current.intakeByDate[dateKey(loggedAtMs)]);
      const log: IntakeLog = { id: crypto.randomUUID(), amountMl: rounded, loggedAtMs };
      const intakeByDate = {
        ...current.intakeByDate,
        [key]: [...(current.intakeByDate[key] ?? []), log],
      };
      const nextToday = dayTotal(intakeByDate[key]);
      let inbox = current.inbox;
      const fresh = unlockedAchievements(intakeByDate, target).filter((id) => !beforeIds.includes(id));
      for (const id of fresh) {
        inbox = pushInbox(
          "Achievement unlocked",
          `You earned ${ACHIEVEMENTS[id].title}. Keep building the habit!`,
          inbox,
        );
      }
      if (key === dateKey() && previousToday < target / 2 && nextToday >= target / 2 && nextToday < target) {
        inbox = pushInbox("Halfway milestone crushed!", `${Math.round((nextToday / target) * 100)}% of today's goal.`, inbox);
      }
      if (key === dateKey() && previousToday < target && nextToday >= target) {
        inbox = pushInbox(
          "Daily goal reached",
          `You've hit ${formatVolume(nextToday, current.volumeUnit)} / ${formatVolume(target, current.volumeUnit)}.`,
          inbox,
        );
      }
      if (fresh[0]) {
        setCelebration(fresh[0]);
      }
      return { ...current, intakeByDate, inbox };
    });
  }, [pushInbox]);

  useEffect(() => {
    const timer = window.setInterval(() => setNowMs(Date.now()), 20_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!ready || !state.onboardingCompleted || !state.remindersEnabled || state.reminderMode === "off") {
      return;
    }
    const slots = deriveSchedule({
      targetMl,
      wakeTime: state.wakeTime,
      bedTime: state.bedTime,
      lastIntakeMs,
      nowMs,
    });
    const active = slots.find((slot) => slot.isActive);
    if (!active) return;
    const now = new Date(nowMs);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (Math.abs(nowMinutes - active.minutes) > 1) return;
    const reminderKey = `${todayKey}-${active.minutes}`;
    if (state.lastReminderKey === reminderKey) return;
    const title = "Time to drink";
    const body = `${active.title} · ${formatVolume(active.volumeMl, state.volumeUnit)}`;
    commit((current) => {
      if (current.lastReminderKey === reminderKey) return current;
      return {
        ...current,
        lastReminderKey: reminderKey,
        inbox: [{ id: crypto.randomUUID(), title, body, atMs: Date.now() }, ...current.inbox].slice(0, 40),
      };
    });
    if (state.reminderMode === "sound") {
      playChime();
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }, [
    ready,
    state.onboardingCompleted,
    state.remindersEnabled,
    state.reminderMode,
    state.wakeTime,
    state.bedTime,
    state.lastReminderKey,
    state.volumeUnit,
    targetMl,
    lastIntakeMs,
    nowMs,
    todayKey,
  ]);

  const value = useMemo<HydroContextValue>(() => {
    const portion = derivePortionPlan(targetMl, state.wakeTime, state.bedTime);
    const nextMinutes = deriveSchedule({
      targetMl,
      wakeTime: state.wakeTime,
      bedTime: state.bedTime,
      lastIntakeMs,
      nowMs,
    }).find((slot) => slot.isActive);
    return {
      ready,
      state,
      targetMl,
      todayKey,
      todayLogs,
      todayMl,
      streak: currentStreak(state.intakeByDate, new Date(nowMs)),
      level: deriveLevel(sumAllMl(state.intakeByDate)),
      totalMl: sumAllMl(state.intakeByDate),
      portion,
      nextReminderLabel: nextMinutes ? `${nextMinutes.timeLabel} · ${nextMinutes.title}` : null,
      celebration,
      logIntake,
      removeLog: (id) => {
        commit((current) => {
          const intakeByDate: IntakeByDate = {};
          for (const [key, logs] of Object.entries(current.intakeByDate)) {
            const next = logs.filter((log) => log.id !== id);
            if (next.length > 0) intakeByDate[key] = next;
          }
          return { ...current, intakeByDate };
        });
      },
      setSelectedContainer: (amountMl) => commit((current) => ({ ...current, selectedContainerMl: amountMl })),
      addCustomContainer: (amountMl) => {
        const container = { id: crypto.randomUUID(), amountMl: Math.round(amountMl) };
        commit((current) => ({
          ...current,
          customContainers: [...current.customContainers, container],
          selectedContainerMl: container.amountMl,
        }));
      },
      removeCustomContainer: (id) => {
        commit((current) => ({
          ...current,
          customContainers: current.customContainers.filter((item) => item.id !== id),
        }));
      },
      completeOnboarding: (draft) => {
        commit((current) => ({
          ...current,
          ...draft,
          onboardingCompleted: true,
          onboardingCompletedAtMs: current.onboardingCompletedAtMs ?? Date.now(),
          inbox: current.inbox.some((item) => item.title === "Welcome to HydroFit")
            ? current.inbox
            : [
                {
                  id: crypto.randomUUID(),
                  title: "Welcome to HydroFit",
                  body: "Your personal hydration plan is ready. We'll nudge you between wake and bed.",
                  atMs: Date.now(),
                },
                ...current.inbox,
              ],
        }));
      },
      updateProfile: (patch) => commit((current) => ({ ...current, ...patch })),
      updateBody: (patch) => commit((current) => ({ ...current, ...patch })),
      clearInbox: () => commit((current) => ({ ...current, inbox: [] })),
      dismissCelebration: () => setCelebration(null),
      restoreDefaults: () => {
        setCelebration(null);
        commit(() => initialState);
        window.localStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [celebration, lastIntakeMs, logIntake, nowMs, ready, state, targetMl, todayKey, todayLogs, todayMl]);

  return <HydroContext.Provider value={value}>{children}</HydroContext.Provider>;
}

export function useHydro(): HydroContextValue {
  const value = useContext(HydroContext);
  if (!value) {
    throw new Error("useHydro must be used inside HydroProvider");
  }
  return value;
}

export function containerChoices(custom: CustomContainer[]) {
  return [
    ...CONTAINERS.map((item) => ({ id: item.id, name: item.name, amountMl: item.amountMl })),
    ...custom.map((item) => ({ id: item.id, name: "Custom", amountMl: item.amountMl })),
  ];
}

export async function resizeProfilePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare the photo.");
  }
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

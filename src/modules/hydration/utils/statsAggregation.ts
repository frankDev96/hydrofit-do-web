import { formatDailyGoalLiters, toLocalDateKey } from '@common/utils';

export type StatsTimeframe = 'Day' | 'Week' | 'Month' | 'Year';

export type StatsIntakeLog = {
    amountMl: number;
    loggedAtMs: number;
};

export type StatsIntakeByDate = Record<string, StatsIntakeLog[]>;

export type StatsChartBar = {
    key: string;
    day: string;
    intakeMl: number;
    label: string;
    isCurrent?: boolean;
};

export type StatsTrendDirection = 'up' | 'down' | 'neutral';

export type HydrationStatsViewModel = {
    chartTitle: string;
    chartData: StatsChartBar[];
    currentIndex: number;
    maxIntake: number;
    summary: {
        overline: string;
        valueLabel: string;
        trendLabel: string;
        trendDirection: StatsTrendDirection;
        subtext: string;
    };
    insights: {
        avgIntake: string;
        goalMetDays: string;
    };
    consistency: {
        streakDays: number;
        heatmapOpacities: number[];
        currentIndex: number;
    };
};

type BuildStatsInput = {
    intakeByDate: StatsIntakeByDate | undefined;
    dailyTargetMl: number;
    timeframe: StatsTimeframe;
    now?: Date;
};

type PeriodCopy = {
    chartTitle: string;
    overline: string;
    vs: string;
    beatSubtext: string;
    behindSubtext: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const HOUR_BUCKET_STARTS = [0, 3, 6, 9, 12, 15, 18, 21] as const;
const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const MONTH_LABELS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const;

const PERIOD_COPY: Record<StatsTimeframe, PeriodCopy> = {
    Day: {
        chartTitle: 'HOURLY BREAKDOWN',
        overline: "TODAY'S INTAKE",
        vs: 'YDAY',
        beatSubtext: "You're on track to beat yesterday's hydration total.",
        behindSubtext: "Yesterday's intake was higher — keep sipping.",
    },
    Week: {
        chartTitle: 'DAILY BREAKDOWN',
        overline: 'WEEKLY AVG',
        vs: 'LAST WK',
        beatSubtext: "You're on track to beat last week's hydration goal.",
        behindSubtext: "Last week's intake was higher — keep sipping.",
    },
    Month: {
        chartTitle: 'WEEKLY BREAKDOWN',
        overline: 'MONTHLY AVG',
        vs: 'LAST MO',
        beatSubtext: "You're on track to beat last month's hydration goal.",
        behindSubtext: "Last month's intake was higher — keep sipping.",
    },
    Year: {
        chartTitle: 'MONTHLY BREAKDOWN',
        overline: 'YEARLY AVG',
        vs: 'LAST YR',
        beatSubtext: "You're on track to beat last year's hydration goal.",
        behindSubtext: "Last year's intake was higher — keep sipping.",
    },
};

const NEW_PERIOD_SUBTEXT = 'Keep logging to compare against your previous period.';

export function buildHydrationStats({
    intakeByDate,
    dailyTargetMl,
    timeframe,
    now = new Date(),
}: BuildStatsInput): HydrationStatsViewModel {
    const records = intakeByDate ?? {};
    const target = dailyTargetMl > 0 ? dailyTargetMl : 2400;
    const today = startOfDay(now);
    const copy = PERIOD_COPY[timeframe];

    const chartData = buildChartData(records, timeframe, now);
    const currentIndex = Math.max(
        0,
        chartData.findIndex(bar => bar.isCurrent),
    );
    const maxIntake = Math.max(...chartData.map(bar => bar.intakeMl), scaleForTimeframe(timeframe, target), 1);

    const currentAvg = averageDailyIntake(records, timeframe, today, 'current');
    const previousAvg = averageDailyIntake(records, timeframe, today, 'previous');
    const trend = buildTrend(currentAvg, previousAvg, copy.vs);

    const goal = countGoalDays(records, timeframe, today, target);
    const heatmapOpacities = chartData.map(bar => opacityFor(bar.intakeMl, maxIntake));

    return {
        chartTitle: copy.chartTitle,
        chartData,
        currentIndex,
        maxIntake,
        summary: {
            overline: copy.overline,
            valueLabel: formatMlLabel(timeframe === 'Day' ? sumForDate(records, today) : currentAvg),
            trendLabel: trend.label,
            trendDirection: trend.direction,
            subtext: trend.subtext(copy),
        },
        insights: {
            avgIntake: formatDailyGoalLiters(timeframe === 'Day' ? sumForDate(records, today) : currentAvg),
            goalMetDays: formatGoalMet(goal.met, goal.elapsed),
        },
        consistency: {
            streakDays: computeStreak(records, today),
            heatmapOpacities,
            currentIndex,
        },
    };
}

function buildChartData(records: StatsIntakeByDate, timeframe: StatsTimeframe, now: Date): StatsChartBar[] {
    switch (timeframe) {
        case 'Day':
            return buildHourlyBars(records, now);
        case 'Week':
            return buildDailyBars(records, now);
        case 'Month':
            return buildWeeklyBars(records, now);
        case 'Year':
            return buildMonthlyBars(records, now);
    }
}

function buildHourlyBars(records: StatsIntakeByDate, now: Date): StatsChartBar[] {
    const logs = records[toLocalDateKey(now)] ?? [];
    const currentHour = now.getHours();

    return HOUR_BUCKET_STARTS.map(startHour => {
        const endHour = startHour + 3;
        const intakeMl = logs.reduce((total, log) => {
            const hour = new Date(log.loggedAtMs).getHours();
            return hour >= startHour && hour < endHour ? total + log.amountMl : total;
        }, 0);

        return {
            key: `hour-${startHour}`,
            day: hourBucketLabel(startHour),
            intakeMl,
            label: formatDailyGoalLiters(intakeMl),
            isCurrent: currentHour >= startHour && currentHour < endHour,
        };
    });
}

function buildDailyBars(records: StatsIntakeByDate, now: Date): StatsChartBar[] {
    const monday = mondayOfWeek(now);
    const todayKey = toLocalDateKey(now);

    return WEEKDAY_LABELS.map((day, index) => {
        const date = addDays(monday, index);
        const key = toLocalDateKey(date);
        const intakeMl = sumLogs(records[key]);
        return {
            key,
            day,
            intakeMl,
            label: formatDailyGoalLiters(intakeMl),
            isCurrent: key === todayKey,
        };
    });
}

function buildWeeklyBars(records: StatsIntakeByDate, now: Date): StatsChartBar[] {
    const year = now.getFullYear();
    const month = now.getMonth();
    const days = daysInMonth(year, month);
    const todayDay = now.getDate();
    const buckets: StatsChartBar[] = [];

    for (let startDay = 1, week = 1; startDay <= days; startDay += 7, week += 1) {
        const endDay = Math.min(startDay + 6, days);
        let intakeMl = 0;
        for (let day = startDay; day <= endDay; day += 1) {
            intakeMl += sumForDate(records, new Date(year, month, day));
        }
        buckets.push({
            key: `week-${year}-${month}-${week}`,
            day: `W${week}`,
            intakeMl,
            label: formatDailyGoalLiters(intakeMl),
            isCurrent: todayDay >= startDay && todayDay <= endDay,
        });
    }

    return buckets;
}

function buildMonthlyBars(records: StatsIntakeByDate, now: Date): StatsChartBar[] {
    const year = now.getFullYear();
    const currentMonth = now.getMonth();

    return MONTH_LABELS.map((day, month) => {
        const days = daysInMonth(year, month);
        let intakeMl = 0;
        for (let date = 1; date <= days; date += 1) {
            intakeMl += sumForDate(records, new Date(year, month, date));
        }
        return {
            key: `month-${year}-${month}`,
            day,
            intakeMl,
            label: formatDailyGoalLiters(intakeMl),
            isCurrent: month === currentMonth,
        };
    });
}

function averageDailyIntake(
    records: StatsIntakeByDate,
    timeframe: StatsTimeframe,
    today: Date,
    which: 'current' | 'previous',
): number {
    const range = periodRange(timeframe, today, which);
    const elapsed = countElapsedDays(range.start, range.end, today);
    if (elapsed <= 0) {
        return 0;
    }
    return sumDateRange(records, range.start, minDate(range.end, today)) / elapsed;
}

function periodRange(
    timeframe: StatsTimeframe,
    today: Date,
    which: 'current' | 'previous',
): { start: Date; end: Date } {
    const offset = which === 'current' ? 0 : -1;

    switch (timeframe) {
        case 'Day': {
            const day = addDays(today, offset);
            return { start: day, end: day };
        }
        case 'Week': {
            const thisMonday = mondayOfWeek(today);
            const monday = addDays(thisMonday, offset * 7);
            const daysFromMonday = Math.round((today.getTime() - thisMonday.getTime()) / MS_PER_DAY);
            return { start: monday, end: addDays(monday, daysFromMonday) };
        }
        case 'Month': {
            const monthStart = new Date(today.getFullYear(), today.getMonth() + offset, 1);
            const lastDay = daysInMonth(monthStart.getFullYear(), monthStart.getMonth());
            const endDay = which === 'current' ? today.getDate() : Math.min(today.getDate(), lastDay);
            return { start: monthStart, end: new Date(monthStart.getFullYear(), monthStart.getMonth(), endDay) };
        }
        case 'Year': {
            const year = today.getFullYear() + offset;
            const endMonth = today.getMonth();
            const lastDay = Math.min(today.getDate(), daysInMonth(year, endMonth));
            return { start: new Date(year, 0, 1), end: new Date(year, endMonth, lastDay) };
        }
    }
}

function countGoalDays(
    records: StatsIntakeByDate,
    timeframe: StatsTimeframe,
    today: Date,
    target: number,
): { met: number; elapsed: number } {
    const { start, end } = periodRange(timeframe, today, 'current');
    const last = minDate(end, today);
    let met = 0;
    let elapsed = 0;

    for (let date = startOfDay(start); date.getTime() <= last.getTime(); date = addDays(date, 1)) {
        elapsed += 1;
        if (sumForDate(records, date) >= target) {
            met += 1;
        }
    }

    return { met, elapsed };
}

/** Consecutive calendar days with any logged intake, walking back from today. */
function computeStreak(records: StatsIntakeByDate, today: Date): number {
    let cursor = startOfDay(today);
    if (sumForDate(records, cursor) <= 0) {
        cursor = addDays(cursor, -1);
    }

    let streak = 0;
    const earliest = addDays(cursor, -730);
    while (cursor.getTime() >= earliest.getTime()) {
        if (sumForDate(records, cursor) <= 0) {
            break;
        }
        streak += 1;
        cursor = addDays(cursor, -1);
    }
    return streak;
}

function buildTrend(
    current: number,
    previous: number,
    vs: string,
): { label: string; direction: StatsTrendDirection; subtext: (copy: PeriodCopy) => string } {
    if (previous <= 0 && current <= 0) {
        return {
            label: `0% VS ${vs}`,
            direction: 'neutral',
            subtext: () => NEW_PERIOD_SUBTEXT,
        };
    }
    if (previous <= 0) {
        return {
            label: 'NEW',
            direction: 'up',
            subtext: () => NEW_PERIOD_SUBTEXT,
        };
    }

    const pct = Math.round(((current - previous) / previous) * 100);
    const direction: StatsTrendDirection = pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral';
    const sign = pct > 0 ? '+' : '';

    return {
        label: `${sign}${pct}% VS ${vs}`,
        direction,
        subtext: copy => {
            if (direction === 'up') {
                return copy.beatSubtext;
            }
            if (direction === 'down') {
                return copy.behindSubtext;
            }
            return "You're matching your previous hydration pace.";
        },
    };
}

function scaleForTimeframe(timeframe: StatsTimeframe, dailyTargetMl: number): number {
    switch (timeframe) {
        case 'Day':
            return Math.max(dailyTargetMl / HOUR_BUCKET_STARTS.length, 1);
        case 'Week':
            return dailyTargetMl;
        case 'Month':
            return dailyTargetMl * 7;
        case 'Year':
            return dailyTargetMl * 30;
    }
}

function opacityFor(intakeMl: number, scale: number): number {
    if (intakeMl <= 0 || scale <= 0) {
        return 0.15;
    }
    return Math.min(1, 0.25 + 0.75 * (intakeMl / scale));
}

function formatMlLabel(ml: number): string {
    const rounded = Math.round(Math.max(ml, 0));
    const withCommas = String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${withCommas} ml`;
}

function formatGoalMet(met: number, elapsed: number): string {
    const total = Math.max(elapsed, 1);
    const unit = total === 1 ? 'Day' : 'Days';
    return `${met}/${total} ${unit}`;
}

function hourBucketLabel(startHour: number): string {
    const hour12 = startHour % 12 === 0 ? 12 : startHour % 12;
    const period = startHour < 12 ? 'a' : 'p';
    return `${hour12}${period}`;
}

function sumLogs(logs: StatsIntakeLog[] | undefined): number {
    if (!logs || logs.length === 0) {
        return 0;
    }
    return logs.reduce((total, log) => total + log.amountMl, 0);
}

function sumForDate(records: StatsIntakeByDate, date: Date): number {
    return sumLogs(records[toLocalDateKey(date)]);
}

function sumDateRange(records: StatsIntakeByDate, start: Date, end: Date): number {
    const last = startOfDay(end);
    let total = 0;
    for (let date = startOfDay(start); date.getTime() <= last.getTime(); date = addDays(date, 1)) {
        total += sumForDate(records, date);
    }
    return total;
}

function countElapsedDays(start: Date, end: Date, today: Date): number {
    const last = minDate(startOfDay(end), startOfDay(today));
    const first = startOfDay(start);
    if (last.getTime() < first.getTime()) {
        return 0;
    }
    return Math.round((last.getTime() - first.getTime()) / MS_PER_DAY) + 1;
}

function mondayOfWeek(date: Date): Date {
    const start = startOfDay(date);
    const weekday = start.getDay();
    const offset = weekday === 0 ? -6 : 1 - weekday;
    return addDays(start, offset);
}

function daysInMonth(year: number, monthIndex: number): number {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, amount: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function minDate(left: Date, right: Date): Date {
    return left.getTime() <= right.getTime() ? left : right;
}

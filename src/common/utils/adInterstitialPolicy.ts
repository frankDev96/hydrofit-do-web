/**
 * When a full-screen ad may follow a successful water log.
 * Never on launch; never on every tap. One call per log covers both caps.
 */
export function shouldOfferInterstitial(logCountToday: number, didJustHitDailyGoal: boolean): boolean {
    if (logCountToday <= 0) {
        return false;
    }
    if (didJustHitDailyGoal) {
        return true;
    }
    return logCountToday % 3 === 0;
}

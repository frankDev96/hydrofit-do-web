export function isBedTimeAfterWakeTime(wakeTime: string, bedTime: string): boolean {
    const [wH, wM] = wakeTime.split(':').map(Number);
    const [bH, bM] = bedTime.split(':').map(Number);
    return bH * 60 + bM > wH * 60 + wM;
}

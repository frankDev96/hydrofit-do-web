/**
 * Quick-log millilitre chips shared by LogIntakeModal and the home-screen widget.
 */
export const INTAKE_QUICK_PRESETS = [150, 250, 500, 750] as const;

export type IntakeQuickPreset = (typeof INTAKE_QUICK_PRESETS)[number];

export function isIntakeQuickPreset(value: unknown): value is IntakeQuickPreset {
    const amount = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
    return (INTAKE_QUICK_PRESETS as readonly number[]).includes(amount);
}

export function parseIntakeQuickPreset(value: unknown): IntakeQuickPreset | null {
    return isIntakeQuickPreset(value) ? (Number(value) as IntakeQuickPreset) : null;
}

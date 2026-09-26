import { describe, expect, it } from 'vitest';
import { INTAKE_QUICK_PRESETS, isIntakeQuickPreset, parseIntakeQuickPreset } from './intakePresets';

describe('intakePresets', () => {
    it('lists the Log Intake quick amounts', () => {
        expect(INTAKE_QUICK_PRESETS).toEqual([150, 250, 500, 750]);
    });

    it('accepts preset numbers and numeric strings', () => {
        expect(isIntakeQuickPreset(250)).toBe(true);
        expect(isIntakeQuickPreset('500')).toBe(true);
        expect(isIntakeQuickPreset(100)).toBe(false);
        expect(isIntakeQuickPreset('nope')).toBe(false);
        expect(parseIntakeQuickPreset(150)).toBe(150);
        expect(parseIntakeQuickPreset('750')).toBe(750);
        expect(parseIntakeQuickPreset(undefined)).toBeNull();
    });
});

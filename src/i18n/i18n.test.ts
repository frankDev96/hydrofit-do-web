import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from '@stores';
import {
    LanguageConfig,
    catalogs,
    getLanguageDefinition,
    resolveLanguageCode,
    supportedLanguageList,
    t,
    translate,
    translateForCode,
} from './index';

describe('i18n language config', () => {
    it('defaults to English', () => {
        expect(LanguageConfig.defaultLanguage).toBe('en');
        expect(LanguageConfig.supportedLanguages.en.locale).toBe('en-US');
        expect(LanguageConfig.supportedLanguages.en.nativeName).toBe('English (US)');
    });

    it('resolves en and en-* tags to en', () => {
        expect(resolveLanguageCode('en')).toBe('en');
        expect(resolveLanguageCode('en-US')).toBe('en');
        expect(resolveLanguageCode('en_GB')).toBe('en');
        expect(resolveLanguageCode('fr-FR')).toBe('en');
        expect(resolveLanguageCode(undefined)).toBe('en');
    });

    it('resolves ml and ml-* tags to ml', () => {
        expect(resolveLanguageCode('ml')).toBe('ml');
        expect(resolveLanguageCode('ml-IN')).toBe('ml');
        expect(resolveLanguageCode('ml_IN')).toBe('ml');
    });

    it('resolves ta, kn, te, hi and regional tags', () => {
        expect(resolveLanguageCode('ta')).toBe('ta');
        expect(resolveLanguageCode('ta-IN')).toBe('ta');
        expect(resolveLanguageCode('kn')).toBe('kn');
        expect(resolveLanguageCode('kn-IN')).toBe('kn');
        expect(resolveLanguageCode('te')).toBe('te');
        expect(resolveLanguageCode('te_IN')).toBe('te');
        expect(resolveLanguageCode('hi')).toBe('hi');
        expect(resolveLanguageCode('hi-IN')).toBe('hi');
    });

    it('returns language definition for configured locale', () => {
        expect(getLanguageDefinition('en-US').nativeName).toBe('English (US)');
        expect(getLanguageDefinition('ml').nativeName).toBe('മലയാളം');
        expect(getLanguageDefinition('ta').nativeName).toBe('தமிழ்');
        expect(getLanguageDefinition('kn').nativeName).toBe('ಕನ್ನಡ');
        expect(getLanguageDefinition('te').nativeName).toBe('తెలుగు');
        expect(getLanguageDefinition('hi').nativeName).toBe('हिन्दी');
    });

    it('lists supported languages with English first', () => {
        expect(supportedLanguageList.map(language => language.code)).toEqual(['en', 'ml', 'ta', 'kn', 'te', 'hi']);
    });
});

describe('translate', () => {
    it('returns English strings and interpolates params', () => {
        expect(translateForCode('en', 'settings.title')).toBe('Settings');
        expect(translate('en', 'home.mascotSubtitle', { percent: 42 })).toBe(
            '42% reached. Sip regularly to hit your goal!',
        );
        expect(translate('en', 'settings.privacyOnDeviceHeading')).toBe('On-device data');
        expect(translate('en', 'ads.bannerA11y')).toBe('Advertisement');
        expect(translate('en', 'ads.closeA11y')).toBe('Close advertisement');
        expect(translate('en', 'settings.adPrivacy')).toBe('Ads & privacy');
        expect(translate('en', 'home.targetLabel', { amount: 4450 })).toBe('of 4450 ml goal');
        expect(translate('en', 'common.unitMl', { amount: 250 })).toBe('250 ml');
    });

    it('returns Malayalam strings for ml catalog', () => {
        expect(translateForCode('ml', 'settings.title')).toBe('ക്രമീകരണങ്ങൾ');
        expect(translateForCode('ml', 'tabs.home')).toBe('ഹോം');
        expect(translate('ml', 'common.unitMl', { amount: 250 })).toBe('250 ml');
    });

    it('returns Indic locale strings', () => {
        expect(translateForCode('ta', 'settings.title')).toBe('அமைப்புகள்');
        expect(translateForCode('kn', 'settings.title')).toBe('ಸೆಟ್ಟಿಂಗ್‌ಗಳು');
        expect(translateForCode('te', 'settings.title')).toBe('సెట్టింగ్‌లు');
        expect(translateForCode('hi', 'settings.title')).toBe('सेटिंग्स');
        expect(translate('hi', 'common.unitMl', { amount: 250 })).toBe('250 ml');
    });

    it('falls back to the key when missing', () => {
        // @ts-expect-error intentional unknown key for fallback coverage
        expect(translateForCode('en', 'missing.key')).toBe('missing.key');
    });
});

describe('t() with app store language', () => {
    beforeEach(() => {
        useAppStore.getState().reset();
    });

    it('reads language from useAppStore', () => {
        expect(t('tabs.home')).toBe('Home');
        useAppStore.getState().setLanguage('en');
        expect(t('settings.englishUs')).toBe('English (US)');
    });
});

function catalogLeafKeys(value: unknown, prefix = ''): string[] {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
            catalogLeafKeys(nested, prefix ? `${prefix}.${key}` : key),
        );
    }
    return prefix ? [prefix] : [];
}

describe('locale catalogs', () => {
    it('keeps the same keys across all six languages', () => {
        const englishKeys = catalogLeafKeys(catalogs.en).sort();
        for (const [code, catalog] of Object.entries(catalogs)) {
            expect({ locale: code, keys: catalogLeafKeys(catalog).sort() }).toEqual({
                locale: code,
                keys: englishKeys,
            });
        }
    });
});

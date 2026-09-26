import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

export type LanguageCode = 'en' | 'ml' | 'ta' | 'kn' | 'te' | 'hi';

export type LanguageDefinition = {
    code: LanguageCode;
    locale: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
};

export const LanguageConfig = {
    defaultLanguage: 'en' as const satisfies LanguageCode,
    fallbackLanguage: 'en' as const satisfies LanguageCode,
    supportedLanguages: {
        en: {
            code: 'en',
            locale: 'en-US',
            name: 'English',
            nativeName: 'English (US)',
            direction: 'ltr',
        },
        ml: {
            code: 'ml',
            locale: 'ml-IN',
            name: 'Malayalam',
            nativeName: 'മലയാളം',
            direction: 'ltr',
        },
        ta: {
            code: 'ta',
            locale: 'ta-IN',
            name: 'Tamil',
            nativeName: 'தமிழ்',
            direction: 'ltr',
        },
        kn: {
            code: 'kn',
            locale: 'kn-IN',
            name: 'Kannada',
            nativeName: 'ಕನ್ನಡ',
            direction: 'ltr',
        },
        te: {
            code: 'te',
            locale: 'te-IN',
            name: 'Telugu',
            nativeName: 'తెలుగు',
            direction: 'ltr',
        },
        hi: {
            code: 'hi',
            locale: 'hi-IN',
            name: 'Hindi',
            nativeName: 'हिन्दी',
            direction: 'ltr',
        },
    } satisfies Record<LanguageCode, LanguageDefinition>,
} as const;

export type TranslationCatalog = typeof en;

export const catalogs: Record<LanguageCode, TranslationCatalog> = {
    en,
    ml: ml as TranslationCatalog,
    ta: ta as TranslationCatalog,
    kn: kn as TranslationCatalog,
    te: te as TranslationCatalog,
    hi: hi as TranslationCatalog,
};

/**
 * Normalize persisted / device language tags onto a supported LanguageCode.
 * Accepts `en`, `en-US`, `ml`, `ta`, `kn`, `te`, `hi`, and regional variants.
 */
export function resolveLanguageCode(language: string | null | undefined): LanguageCode {
    if (!language) {
        return LanguageConfig.defaultLanguage;
    }

    const normalized = language.trim().toLowerCase().replace('_', '-');
    if (normalized === 'en' || normalized.startsWith('en-')) {
        return 'en';
    }
    if (normalized === 'ml' || normalized.startsWith('ml-')) {
        return 'ml';
    }
    if (normalized === 'ta' || normalized.startsWith('ta-')) {
        return 'ta';
    }
    if (normalized === 'kn' || normalized.startsWith('kn-')) {
        return 'kn';
    }
    if (normalized === 'te' || normalized.startsWith('te-')) {
        return 'te';
    }
    if (normalized === 'hi' || normalized.startsWith('hi-')) {
        return 'hi';
    }

    return LanguageConfig.fallbackLanguage;
}

export function getLanguageDefinition(language: string | null | undefined): LanguageDefinition {
    const code = resolveLanguageCode(language);
    return LanguageConfig.supportedLanguages[code];
}

/** Stable UI order: English first, then remaining supported languages. */
export const supportedLanguageList: readonly LanguageDefinition[] = [
    LanguageConfig.supportedLanguages.en,
    LanguageConfig.supportedLanguages.ml,
    LanguageConfig.supportedLanguages.ta,
    LanguageConfig.supportedLanguages.kn,
    LanguageConfig.supportedLanguages.te,
    LanguageConfig.supportedLanguages.hi,
];

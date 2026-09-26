import { useAppStore } from '../stores/useAppStore';
import { getLanguageDefinition, resolveLanguageCode, type LanguageDefinition } from './config';
import { translate, type TranslationKey, type TranslationParams } from './translate';

export type TranslateFn = (key: TranslationKey, params?: TranslationParams) => string;

/**
 * Imperative translator for non-React modules (utils, stores).
 * Reads the active language from useAppStore.
 */
export function t(key: TranslationKey, params?: TranslationParams): string {
    const language = useAppStore.getState().language;
    return translate(language, key, params);
}

/**
 * React hook bound to the persisted app language.
 */
export function useTranslation(): {
    t: TranslateFn;
    language: string;
    languageCode: ReturnType<typeof resolveLanguageCode>;
    languageDefinition: LanguageDefinition;
} {
    const language = useAppStore(state => state.language);
    const languageCode = resolveLanguageCode(language);
    const languageDefinition = getLanguageDefinition(language);

    const boundT: TranslateFn = (key, params) => translate(language, key, params);

    return {
        t: boundT,
        language,
        languageCode,
        languageDefinition,
    };
}

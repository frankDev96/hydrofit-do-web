export { LanguageConfig, catalogs, getLanguageDefinition, resolveLanguageCode, supportedLanguageList } from './config';
export type { LanguageCode, LanguageDefinition, TranslationCatalog } from './config';
export { translate, translateForCode } from './translate';
export type { TranslationKey, TranslationParams } from './translate';
export { t, useTranslation } from './useTranslation';
export type { TranslateFn } from './useTranslation';

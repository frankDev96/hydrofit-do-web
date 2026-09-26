import { catalogs, resolveLanguageCode, type LanguageCode, type TranslationCatalog } from './config';

type Primitive = string | number | boolean | null | undefined;

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type NestedKeyOf<T> = T extends Primitive
    ? never
    : {
          [K in keyof T & string]: T[K] extends Primitive ? K : K | Join<K, NestedKeyOf<T[K]>>;
      }[keyof T & string];

export type TranslationKey = NestedKeyOf<TranslationCatalog>;

export type TranslationParams = Record<string, string | number>;

function readPath(catalog: TranslationCatalog, key: string): string | undefined {
    const parts = key.split('.');
    let current: unknown = catalog;

    for (const part of parts) {
        if (current === null || typeof current !== 'object' || !(part in current)) {
            return undefined;
        }
        current = (current as Record<string, unknown>)[part];
    }

    return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, params?: TranslationParams): string {
    if (!params) {
        return template;
    }

    return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
        const value = params[name];
        return value === undefined ? `{{${name}}}` : String(value);
    });
}

export function translate(language: string, key: TranslationKey, params?: TranslationParams): string {
    const code = resolveLanguageCode(language);
    return translateForCode(code, key, params);
}

export function translateForCode(code: LanguageCode, key: TranslationKey, params?: TranslationParams): string {
    const primary = readPath(catalogs[code], key);
    if (primary !== undefined) {
        return interpolate(primary, params);
    }

    const fallback = readPath(catalogs.en, key);
    if (fallback !== undefined) {
        return interpolate(fallback, params);
    }

    return key;
}

import { id } from './id';
import { en } from './en';

export const translations = { id, en };

export function translate(lang, path, params = {}) {
  const dictionary = translations[lang] || translations.id;
  const keys = path.split('.');
  
  let current = dictionary;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to id if key not found in en
      let fallbackCurrent = translations.id;
      for (const fallbackKey of keys) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fallbackKey in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fallbackKey];
        } else {
          return path;
        }
      }
      current = fallbackCurrent;
      break;
    }
  }

  if (typeof current !== 'string') {
    return path;
  }

  let result = current;
  for (const [paramKey, paramVal] of Object.entries(params)) {
    result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramVal));
  }

  return result;
}

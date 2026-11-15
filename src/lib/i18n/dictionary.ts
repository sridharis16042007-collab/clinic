import en from '../../../messages/en.json';
import ta from '../../../messages/ta.json';
import { SupportedLanguage } from '@/types/clinic';

const dictionaries = {
  en,
  ta,
};

export type Dictionary = typeof en;

export function getDictionary(lang: SupportedLanguage = 'en'): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}

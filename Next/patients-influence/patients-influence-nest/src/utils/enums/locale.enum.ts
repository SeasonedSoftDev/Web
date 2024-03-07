export enum Locale {
  en = 'en-US',
  'en-US' = 'en-US',
  'en-GB' = 'en-US',
  de = 'de-DE',
  'de-DE' = 'de-DE',
}

export type TLocale = (typeof Locale)[keyof typeof Locale];

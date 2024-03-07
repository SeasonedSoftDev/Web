import { Locale } from '../enums';

export const generateLocaleUrl = (
  baseUrl: string,
  route: string,
  locale: Locale | string,
) => {
  const localeNormalized = Object.keys(Locale).includes(locale)
    ? Locale[locale]
    : Locale.en;

  const url = locale.includes('en')
    ? `${baseUrl}${route}`
    : `${baseUrl}/${localeNormalized}${route}`;

  return url;
};

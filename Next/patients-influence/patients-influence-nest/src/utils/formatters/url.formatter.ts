import { Locale } from '../enums';

export const formatUrl = (baseUrl: string, route: string, locale: Locale) => {
  const url =
    locale === Locale.en
      ? `${baseUrl}${route}`
      : `${baseUrl}/${locale}${route}`;

  return url;
};

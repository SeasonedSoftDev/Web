export const formatLongString = (longText: string, length: number): string => {
  if (longText.length >= length) {
    return `${longText.slice(0, length)}...`;
  }
  return longText;
};

export const capitalizeString = (string: string): string => {
  const capitalizedString = string.charAt(0).toUpperCase() + string.slice(1);
  return capitalizedString;
};

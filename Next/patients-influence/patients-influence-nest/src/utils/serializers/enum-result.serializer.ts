export const serializeEnum = <T extends Record<string, string | number>>(
  enumObj: T,
) => {
  return Object.keys(enumObj)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({ name: key.replace(/_/g, ' '), value: enumObj[key] }));
};

export function setEmptyToUndefined(
  obj: object | any[],
): object | any[] | null {
  if (
    [undefined, null].includes(obj) ||
    typeof obj === 'string' ||
    typeof obj === 'number'
  )
    return obj;

  if (Array.isArray(obj)) {
    return obj.length === 0 ? undefined : obj;
  } else {
    return Object.keys(obj).length === 0 ? undefined : obj;
  }
}

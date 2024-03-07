export function setEmptyToNull(obj: object | any[]): object | any[] | null {
  if (
    [undefined, null].includes(obj) ||
    typeof obj === 'string' ||
    typeof obj === 'number'
  )
    return obj;

  if (Array.isArray(obj)) {
    return obj.length === 0 ? null : obj;
  } else {
    return Object.keys(obj).length === 0 ? null : obj;
  }
}

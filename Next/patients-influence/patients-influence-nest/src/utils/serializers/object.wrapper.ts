/**
 * Use it if the controller function response is simple, eg single object. If the
 * response is a type of an array of objects that have to be serialized, you can
 * use the same `wrapObject()` function by iterating over an array, but if you
 * want to make it easier, use `serializeArray()` function. In that case, use
 * `@NoAutoSerialize()` to avoid `classToPlain` (`instanceToPlain`) execution
 * duplicate.
 *
 * @param object any object
 * @param outputType wrapper class
 * @returns wrapped object
 */
export const wrapObject = <T>(
  object: any,
  outputType: new (object: any) => T,
) => {
  // example: new UserEntity(req.user)
  return new outputType(object);
};

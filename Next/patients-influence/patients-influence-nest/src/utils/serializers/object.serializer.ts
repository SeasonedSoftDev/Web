import { instanceToPlain } from 'class-transformer';
import { wrapObject } from './object.wrapper';

/**
 * Use it together with `@NoAutoSerialize()` decorator over a controller function.
 * In some cases, if controller function response is complex, eg. root object is not
 * type of a class, this function makes sure the object is serialized properly. Some
 * common examples include serializing `express.Request` object's body content, not
 * the whole `express.Request` object. Also, if the objects that have to be
 * serialized are in sub-properties of response object, this is the function to use.
 *
 * **NOTE:** if the controller function response is simple, eg single object, use
 * `wrapObject()` function. If the response is a type of an array of objects that have
 * to be serialized, you can use the same `wrapObject()` function by iterating over
 * an array, but if you want to make it easier, use `serializeArray()` function. In
 * that case, use `@NoAutoSerialize()` to avoid `classToPlain` (`instanceToPlain`)
 * execution duplicate. Code will not break, but it'll be excess execution.
 *
 * @param object any object
 * @param outputType wrapper class
 * @returns wrapped object
 */
export const serializeObject = <T>(
  object: any,
  outputType: new (object: any) => T,
) => {
  // example: instanceToPlain(new UserEntity(req.user))
  return instanceToPlain(wrapObject(object, outputType));
};

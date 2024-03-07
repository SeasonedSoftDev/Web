import { SetMetadata } from '@nestjs/common';

export const NO_AUTO_SERIALIZE = 'no_auto_serialize';

/**
 * Required in case root object is not an entity object, eg. UserEntity, but
 * Express.Response object instead. ClassSerializerInterceptor doesn't know
 * how to handle it.
 *
 * In the case of using this decorator, if there's serialization involved, but
 * not on the root object, manual serialization is required. By following the
 * example from above when Express.Response is the root object, but its body
 * data has to be serialized, operation has to be made on body object, not on
 * the root object. Good example of using it is on login. Upon login, cookie is
 * returned to the client, but to do it, a whole response object has to be
 * returned, not the user itself.
 *
 * @returns
 */
export const NoAutoSerialize = () => SetMetadata(NO_AUTO_SERIALIZE, true);

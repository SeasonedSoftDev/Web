import { Request } from 'express';
import { UserEntity } from 'src/core/users/entities/user.entity';

export const generateCacheKey = (
  key: string,
  request: Request,
  isUserKey = true,
) => {
  const user = request.user as UserEntity; // retrieve the currently logged-in user

  /* let cacheKey = `${
    `key_${key}` || `url_${request.originalUrl}` // use the request's URL as the cache key if there is no explicit key
  }_query_${JSON.stringify(
    request.query, // use the request's query parameters
  )}`; */
  let cacheKey = `${
    `key_${key}` || `url_${request.originalUrl}` // use the request's URL as the cache key if there is no explicit key
  }`;

  if (isUserKey && cacheKey && user) {
    // build the custom cache key including the user and query parameters
    cacheKey = `user_${user.id}_${cacheKey}`;
  }

  return cacheKey;
};

import { SetMetadata } from '@nestjs/common';

export const CACHE_AND_INVALIDATE = 'cache_and_invalidate';

export interface CacheAndInvalidateOptions {
  invalidatePolicy: 'atEntry' | 'atExit' | 'atCacheHit';
}

export const CacheAndInvalidate = (
  ttl: number,
  key?: string,
  affectedKeys?: string[],
  options: CacheAndInvalidateOptions = {
    invalidatePolicy: 'atExit',
  },
) => {
  return SetMetadata(CACHE_AND_INVALIDATE, { ttl, key, affectedKeys, options });
};

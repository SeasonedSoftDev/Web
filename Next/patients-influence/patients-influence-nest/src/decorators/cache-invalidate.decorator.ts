import { SetMetadata } from '@nestjs/common';

export const CACHE_INVALIDATE = 'cache_invalidate';

export const CacheInvalidate = (...affectedKeys) => {
  return SetMetadata(CACHE_INVALIDATE, affectedKeys);
};

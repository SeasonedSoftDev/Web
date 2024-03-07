import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import { CACHE_INVALIDATE } from 'src/decorators/cache-invalidate.decorator';
import { generateCacheKey } from 'src/utils/generators/cache-key.generator';

export class CacheInvalidateInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const affectedKeys = this.reflector.get<string[]>(
      CACHE_INVALIDATE,
      context.getHandler(),
    ); // retrieve affectedKeys from the decorator

    if (!affectedKeys) return next.handle(); // * suppose CacheInvalidate decorator is not "hooked" to a function, there's no cache invalidation

    return next.handle().pipe(
      tap(async () => {
        // perform cache invalidation for affected keys
        if (affectedKeys && Array.isArray(affectedKeys)) {
          for (const affectedKey of affectedKeys) {
            const cacheKey = generateCacheKey(affectedKey, request);
            await this.cacheManager.del(cacheKey);
          }
        }
      }),
    );
  }
}

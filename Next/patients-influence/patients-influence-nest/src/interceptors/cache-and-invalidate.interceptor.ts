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
import { Observable, of, tap } from 'rxjs';
import { UserEntity } from 'src/core/users/entities/user.entity';
import {
  CACHE_AND_INVALIDATE,
  CacheAndInvalidateOptions,
} from 'src/decorators/cache-and-invalidate.decorator';
import { generateCacheKey } from 'src/utils/generators/cache-key.generator';

export class CacheAndInvalidateInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const decoratorData = this.reflector.get<{
      key: string;
      ttl: number;
      affectedKeys: string[];
      options: CacheAndInvalidateOptions;
    }>(CACHE_AND_INVALIDATE, context.getHandler()); // retrieve key, ttl, and affectedKeys from the decorator

    if (!decoratorData) return next.handle(); // * suppose CacheAndInvalidate decorator is not "hooked" to a function, there's no caching

    const { ttl, key, affectedKeys, options } = decoratorData;
    const cacheKey = generateCacheKey(key, request);

    const cachedData = await this.cacheManager.get(cacheKey);

    if (cachedData) {
      return of(cachedData);
    }

    return next.handle().pipe(
      tap(async (data) => {
        await this.cacheManager.set(cacheKey, data, ttl);
      }),
      tap(async () => {
        // perform cache invalidation for affected keys
        if (affectedKeys && Array.isArray(affectedKeys)) {
          for (const affectedKey of affectedKeys) {
            await this.cacheManager.del(affectedKey);
          }
        }
      }),
    );
  }
}

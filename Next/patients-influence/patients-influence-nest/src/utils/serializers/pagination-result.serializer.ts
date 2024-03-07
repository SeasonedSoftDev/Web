import { PaginationResult } from '../object-definitions/results/pagination-result';
import { serializeArray } from './array.serializer';

/**
 * Wraps the pagination result into entity object.
 * 
 * **NOTE:** Use it together with `@NoAutoSerialize()` decorator over a controller
 * function to avoid `classToPlain` (`instanceToPlain`) execution duplicate. Code
 * will not break, but it'll be excess execution.
 * 
 * First example shows how it's used, second example shows how it was
 * used before:
 * @example
 * return serializePaginationResult(
      await this.influencerService.findAll(
        paginationParamsDto,
        filterParamsDto,
      ),
      UserEntity,
    );
    return serializePaginationResult(
      this.influencerService.findAll(paginationParamsDto, filterParamsDto),
      UserEntity,
    );
 * @example
 * async () => {
        const result = await this.influencerService.findAll(
          paginationParamsDto,
          filterParamsDto,
        );
        result.result = result.result.map((obj) => new UserEntity(obj));

        return result;
      }
 * 
 * @param paginationResult data records retrieved from the service
 * @param outputType entity class wrapping pagination result object/s
 * @returns same result as the input, but with result wrapped in entity class
 */
export const serializePaginationResult = async <T, U>(
  paginationResult: Promise<PaginationResult<T>> | PaginationResult<T>,
  outputType: new (object: any) => U,
) => {
  const paginationResultPromise = Promise.resolve(paginationResult);
  const resolvedPaginationResult: PaginationResult<T> =
    await paginationResultPromise;

  const resolvedPaginationResultResultPromise = Promise.resolve(
    serializeArray<T, U>(
      resolvedPaginationResult.result,
      outputType,
    ) as unknown as Array<T>,
  );
  resolvedPaginationResult.result = await resolvedPaginationResultResultPromise;

  // * force to show for example UserEntity array type of result instead of User
  return resolvedPaginationResult as unknown as PaginationResult<U>;
};

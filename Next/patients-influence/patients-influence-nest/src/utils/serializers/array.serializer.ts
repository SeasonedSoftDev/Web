import { serializeObject } from './object.serializer';

export const serializeArray = async <T, U>(
  array: Promise<Array<T>> | Array<T>,
  outputType: new (object: any) => U,
) => {
  /* example:
      async () => {
        const result = await this.influencerService.findAll(
          paginationParamsDto,
          filterParamsDto,
        );
        result.result = result.result.map((obj) => new UserEntity(obj));

        return result;
      }
  */
  const arrayPromise = Promise.resolve(array);
  const resolvedArray: Array<T> = await arrayPromise;

  return resolvedArray.map((object) => serializeObject(object, outputType));
};

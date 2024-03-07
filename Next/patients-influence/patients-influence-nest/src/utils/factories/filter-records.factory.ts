import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { PaginationResultType } from 'src/utils/object-definitions/types/pagination-result.type';

type FindManyArgs<U, V, E, K, R, A> = {
  select?: U;
  include?: V;
  where?: E;
  orderBy?: K;
  cursor?: R;
  take?: number;
  skip?: number;
  distinct?: A;
};

type CountArgs<U, V, E, K, R, A> = Omit<
  FindManyArgs<U, V, E, K, R, A>,
  'select' | 'include'
> & {
  select?: any | true;
};

export function filterRecordsFactory<
  T extends {
    findMany: (
      args: FindManyArgs<U, V, E, K, R, A>,
    ) => Prisma.PrismaPromise<Array<any>>;
    count: (args?: CountArgs<U, V, E, K, R, A>) => Prisma.PrismaPromise<any>;
  },
  U,
  V,
  E,
  K,
  R,
  A,
>(
  prismaService: PrismaService,
  modelDelegate: (
    tx: Omit<
      PrismaService,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
    >,
  ) => T,
  findManyArgs: FindManyArgs<U, V, E, K, R, A>,
  skipFilteredCount = false,
) {
  return async () => {
    const [records, totalCount, filteredCount] =
      await prismaService.$transaction(async (tx) => {
        const records = await modelDelegate(tx).findMany({
          ...findManyArgs,
        });

        const totalCount = await modelDelegate(tx).count();

        const filteredCount = !skipFilteredCount
          ? await modelDelegate(tx).count({
              where: findManyArgs.where,
            })
          : undefined;

        return [records, totalCount, filteredCount];
      });

    return {
      meta: {
        skip: findManyArgs.skip,
        limit: findManyArgs.take,
        countTotal: totalCount,
        countFiltered: filteredCount,
      },
      result: records,
    };
  };
}

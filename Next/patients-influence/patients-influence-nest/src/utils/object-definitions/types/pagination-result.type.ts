export type PaginationResultType<T> = {
  meta: {
    skip: number;
    limit: number;
    countTotal: number;
    countFiltered: number;
  };
  result: Array<T>;
};

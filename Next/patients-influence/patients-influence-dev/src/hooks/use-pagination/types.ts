export type TUsePaginationData = {
  index: number;
  page: number;
  limit: number;
  skip: number;
};

export type TUsePaginationFunction = (x: number) => any;

export type TUsePagination = {
  page: number;
  limit: number;
  onChange: (
    data: TUsePaginationData,
    setPage: TUsePaginationFunction
  ) => Promise<any>;
};

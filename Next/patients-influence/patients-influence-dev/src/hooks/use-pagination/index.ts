import { useEffect, useMemo, useState } from 'react';

import { TUsePagination } from './types';

const usePagination = ({
  limit: initialLimit,
  page: initialPage,
  onChange,
}: TUsePagination) => {
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = async (value: number) => {
    const index = value - 1;
    const data = {
      index,
      page: value,
      limit,
      skip: limit * index,
    };
    await onChange(data, setPage);
  };

  useEffect(() => {
    handlePageChange(1);
  }, [limit]);

  const pagesCount = useMemo(
    () => Math.ceil(totalResults / limit),
    [totalResults, limit]
  );

  const reload = async () => {
    await handlePageChange(page);
  };

  return {
    limit,
    page,
    totalResults,
    setTotalResults,
    pagesCount,
    setLimit,
    handlePageChange,
    reload,
  };
};

export default usePagination;

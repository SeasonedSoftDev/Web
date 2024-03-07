import { Selector } from 'src/utils';

type TFormatTableOptions = {
  columns: string[];
  filters: any;
  service: any;
  context: string;
  pagination: {
    skip?: number;
    limit?: number;
  };
  whereAddition?: any;
};

const createSelect = (items: any[]) => {
  const ret = {};

  const _ = (item, select) => {
    for (const [key, value] of Object.entries(item)) {
      if (key === 'where') {
        if (select.hasOwnProperty('where')) {
          select.where.OR.push(value);
        } else {
          select.where = { OR: [value] };
        }
      } else {
        if (typeof value === 'boolean') {
          if (!select[key]) {
            select[key] = value;
          }
        } else {
          if (!select[key]) {
            select[key] = {};
          }
          return _(value, select[key]);
        }
      }
    }
  };

  for (const item of items) {
    _(item, ret);
  }
  return ret;
};

export const withSelectors = async (
  {
    columns,
    filters,
    service,
    context,
    pagination = { skip: 0, limit: 10 },
    whereAddition = {},
  }: TFormatTableOptions,
  selectors: Selector<any, any>[] = [],
) => {
  const allSelectors = selectors.filter((s) => columns.includes(s.key));

  const select = {
    id: true,
    ...createSelect(allSelectors.map((s: any) => s.select)),
  };

  const isValidCase = (x: any) => {
    if (typeof x === 'object' && !(x instanceof Date)) {
      if (x === null) {
        return false;
      }
      if (Array.isArray(x)) {
        return !!x.length;
      }
      return !!Object.keys(x).length;
    }
    return true;
  };

  const where = {
    AND: Object.keys(filters)
      .filter((filter) => isValidCase(filters[filter]))
      .map((filter) => ({
        OR: allSelectors
          .filter((s) => s.filter.hasOwnProperty(filter))
          .map((s) => s.filter[filter](filters)),
      })),
    ...whereAddition,
  };

  const [total, results] = await service.$transaction([
    service[context].count({ where }),
    service[context].findMany({
      where,
      select,
      skip: pagination.skip,
      take: pagination.limit,
    }),
  ]);

  const data = results.map((result) =>
    columns.reduce(
      (prev, curr) => {
        const selectorResult = allSelectors.find((s) => s.key === curr);
        return { ...prev, [curr]: selectorResult.format(result) };
      },
      { id: result.id },
    ),
  );

  const meta = { ...pagination, total };

  return { meta, data };
};

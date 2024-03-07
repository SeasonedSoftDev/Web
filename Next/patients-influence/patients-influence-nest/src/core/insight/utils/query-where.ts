import { GraphType } from '../enums/graph-type.enum';

export const graphQueryWhere = (
  graphType: GraphType,
  dateFrom: Date,
  dateTo: Date,
) => ({
  createdAt:
    graphType === GraphType.Cumulative
      ? { lte: dateTo }
      : { gte: dateFrom, lte: dateTo },
});

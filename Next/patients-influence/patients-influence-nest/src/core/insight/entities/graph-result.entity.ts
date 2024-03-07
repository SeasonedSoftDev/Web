import { getChange } from '../utils/relative-change';
import { GraphDataPointEntity } from './graph-data-point.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Decimal from 'decimal.js';

export class GraphResultEntity {
  // * primarly it will be a number, not "N/A"
  @ApiPropertyOptional({
    description: `Represents a relative difference between last 2 graph points. It means both values used to calculate percentage depend on what graph data points are retrieved (and requested, as primary data).`,
    type: Number,
  })
  changePercentage?: number | string | Decimal;

  //#region GraphIncludeData (enum) values
  @ApiPropertyOptional({
    description: `Part of \`includeData\` query. If the data of the same name is not included in there, this property won't appear in the result.`,
    type: Number,
  })
  changePercentageDay?: number | string | Decimal;

  @ApiPropertyOptional({
    description: `Part of \`includeData\` query. If the data of the same name is not included in there, this property won't appear in the result.`,
    type: Number,
  })
  changePercentageWeek?: number | string | Decimal;

  @ApiPropertyOptional({
    description: `Part of \`includeData\` query. If the data of the same name is not included in there, this property won't appear in the result.`,
    type: Number,
  })
  changePercentageMonth?: number | string | Decimal;

  @ApiPropertyOptional({
    description: `Part of \`includeData\` query. If the data of the same name is not included in there, this property won't appear in the result.`,
    type: Number,
  })
  total?: number | string | Decimal;
  //#endregion

  @ApiProperty({ type: [GraphDataPointEntity] })
  data: GraphDataPointEntity[];

  constructor({ data: dataPoints, ...data }: GraphResultEntity) {
    Object.assign(this, data);

    if (data) {
      this.data = dataPoints;
      this.changePercentage = getChange(
        this.data.at(-1)?.value,
        this.data.at(-2)?.value,
      );

      // * fix non-clean result, eg. -50.000000...
      // * => round it to eg. -50
      // or -67.x to -67.67 etc.
      if (typeof this.changePercentage === 'number') {
        this.changePercentage = new Decimal(this.changePercentage)
          .toDecimalPlaces(2)
          .toNumber();
      }
    }
  }
}

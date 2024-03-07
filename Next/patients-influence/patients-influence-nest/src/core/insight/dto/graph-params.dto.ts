import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { GraphPeriod } from '../enums/graph-period.enum';
import { GraphType } from '../enums/graph-type.enum';
import { Transform, Type } from 'class-transformer';
import { decorate } from 'ts-mixer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { GraphIncludeData } from '../enums/graph-include-data.enum';

export class GraphParamsDto {
  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) => (obj.useStrictPeriod === 'true' ? true : false)),
  )
  @decorate(
    ApiPropertyOptional({
      description: `<strong>IMPORTANT</strong><br><br>If \`true\`, \`graphPeriod\` property is used, else \`numberOfPoints\` property is used.`,
      type: Boolean,
      default: true,
    }),
  )
  // alternative: hasFixedNumberOfPoints?: boolean = false;
  useStrictPeriod?: boolean = true;

  @decorate(IsEnum(GraphPeriod))
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description: `Set distance between each data point. Number of data points is predefined and depends on selected graph period.`,
      enum: GraphPeriod,
      default: GraphPeriod.Monthly,
    }),
  )
  graphPeriod?: GraphPeriod = GraphPeriod.Monthly;

  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Min(2))
  @decorate(Type(() => Number))
  @decorate(
    ApiPropertyOptional({
      description: `Set number of data points returned. Period size is dynamic, eg. depends on total range of values and number of data points that represent that range.`,
      type: Number,
      default: 10,
      minimum: 2,
    }),
  )
  numberOfPoints?: number = 10;

  @decorate(IsEnum(GraphType))
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description: `Graph can show data in 2 ways: period based, cumulative. When period based graph is selected, at the beginning of each period, data is reseted, eg. value is set to zero and counted upwards or downwards until end of that same period. When cumulative graph is selected, there is no reset, eg. first value on next period is the same, went upwards or downwards relative to the last value of a previous period. In other way, cumulative graph is a graph where each next period depends on previous period, and period based graph does not depend on any other period at all.`,
      enum: GraphType,
      default: GraphType.PeriodBased,
    }),
  )
  // * even if PeriodBased is not explicitly defined, it'll be used as the default because of the implementation
  graphType?: GraphType = GraphType.PeriodBased;

  @decorate(IsNumber())
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description:
        'It restricts number of data points that are supposed to return. If this property exceeds that number, it behaves like maximum is not defined.',
      type: Number,
    }),
  )
  maxResults?: number;

  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) => (obj.roundDateToDay === 'true' ? true : false)),
  )
  @decorate(
    ApiPropertyOptional({
      description: `If set to \`true\`, any given time is resetted to midnight, eg. 00:00 of that same day. If time is for example "2023-05-12T15:15:15.150Z", this property sets it to "2023-05-12T00:00:00.000Z".`,
      type: Boolean,
      default: false,
    }),
  )
  roundDateToDay?: boolean = false;

  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) => (obj.roundDateToMonth === 'true' ? true : false)),
  )
  @decorate(
    ApiPropertyOptional({
      description: `If set to \`true\`, any given time is resetted to the first day of the month, eg. 00:00 of the first day of that same month. If time is for example "2023-05-12T15:15:15.150Z", this property sets it to "2023-05-01T00:00:00.000Z".`,
      type: Boolean,
      default: false,
    }),
  )
  roundDateToMonth?: boolean = false;

  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) =>
      obj.includeOngoingPeriod === 'true' ? true : false,
    ),
  )
  @decorate(
    ApiPropertyOptional({
      description: `By the default, currently active period is not included, so last data point retrieved is from the period before the current one. If this property is set to \`true\`, current period will be included and will appear as last data point. Data in that period is not fixed and it may change until the period is closed.`,
      type: Boolean,
      default: false,
    }),
  )
  // alternative: includeLastDynamicPeriod
  includeOngoingPeriod?: boolean = false;

  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) =>
      obj.includePeriodBorders === 'true' ? true : false,
    ),
  )
  @decorate(
    ApiPropertyOptional({
      description: `Include intervals in a response for each data point, eg. include start and end time.`,
      type: Boolean,
      default: false,
    }),
  )
  includePeriodBorders?: boolean = false;

  @decorate(IsArray())
  @decorate(IsEnum(GraphIncludeData, { each: true }))
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      description: `Include additional data (multiselect). This is ideal for situations if data out of the scope of selected period is needed.<br><br><strong>NOTE: </strong>Won't work within <strong>Swagger</strong>. Use <strong>Postman</strong>, \`curl\` command or other HTTP client (in spread mode, eg. \`?x[]=1&x[]=2\`, which will in this example give \`x=[1,2]\`).`,
      enum: GraphIncludeData,
      isArray: true,
    }),
  )
  includeData?: GraphIncludeData[];
}

// FixedIntervalGraphParamsDto
export class FixedPeriodGraphParamsDto {
  @IsEnum(GraphPeriod)
  @IsNotEmpty()
  graphPeriod: GraphPeriod;

  @IsEnum(GraphType)
  @IsOptional()
  // * even if PeriodBased is not explicitly defined, it'll be used as the default because of the implementation
  graphType?: GraphType = GraphType.PeriodBased;

  @IsNumber()
  @IsOptional()
  maxResults?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.roundDateToDay === 'true' ? true : false))
  roundDateToDay?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.roundDateToMonth === 'true' ? true : false))
  roundDateToMonth?: boolean = false;

  // includeOngoingPeriod
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) =>
    obj.includeLastDynamicPeriod === 'true' ? true : false,
  )
  includeLastDynamicPeriod?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.includePeriodBorders === 'true' ? true : false))
  includePeriodBorders?: boolean = false;
}

export class NPointGraphParamsDto {
  @decorate(IsEnum(GraphType))
  @decorate(IsOptional())
  @decorate(
    ApiPropertyOptional({
      enum: GraphType,
      default: GraphType.PeriodBased,
    }),
  )
  // * even if PeriodBased is not explicitly defined, it'll be used as the default because of the implementation
  graphType?: GraphType = GraphType.PeriodBased;

  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) =>
      obj.includePeriodBorders === 'true' ? true : false,
    ),
  )
  @decorate(
    ApiPropertyOptional({
      type: Boolean,
      default: false,
    }),
  )
  includePeriodBorders?: boolean = false;

  @decorate(IsOptional())
  @decorate(IsNumber())
  @decorate(Min(2))
  @decorate(Type(() => Number))
  @decorate(
    ApiPropertyOptional({
      type: Number,
      default: 10,
      minimum: 2,
    }),
  )
  numberOfPoints?: number = 10;
}

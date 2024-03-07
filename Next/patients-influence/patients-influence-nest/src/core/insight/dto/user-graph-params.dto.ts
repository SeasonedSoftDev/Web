import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { decorate } from 'ts-mixer';
import { GraphParamsDto } from './graph-params.dto';

export class UserGraphParamsDto extends GraphParamsDto {
  @decorate(IsOptional())
  @decorate(IsBoolean())
  @decorate(
    Transform(({ obj }) =>
      obj.startFromUserRegistration === 'true' ? true : false,
    ),
  )
  @decorate(
    ApiPropertyOptional({
      description: `Data points retrieved start from the time of user registration. If the data fetched is not the user itself but it's related to it, the first data point timestamp starts from the user registration time.<br><br><strong>NOTE: </strong>This property does not have effect if \`useStrictPeriod\` is \`true\`.`,
      type: Boolean,
      default: true,
    }),
  )
  startFromUserRegistration?: boolean = true;
}

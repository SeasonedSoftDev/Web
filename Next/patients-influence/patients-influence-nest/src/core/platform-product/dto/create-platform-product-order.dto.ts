import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { Status } from 'src/core/campaign/enums';
import { FinanceStatus } from 'src/core/campaign/enums/finance-status.enum';

export class CreatePlatformProductOrderDto {
  //* PlatformProductOrder
  @IsInt()
  @IsPositive()
  clientId: number;

  @IsInt()
  @IsPositive()
  platformProduct: number;

  @IsOptional()
  @IsNumber({ allowInfinity: false, maxDecimalPlaces: 2, allowNaN: false })
  @IsPositive()
  budget?: number;

  // @IsOptional()
  // @IsInt()
  // @IsPositive()
  // currency?: number;

  //*ProductOrderLocation
  @IsOptional() //TODO reformat
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  locations?: number[];

  //*ProductOrderDiseaseArea
  @IsArray()
  @Type(() => Number)
  @IsOptional()
  diseaseAreas?: number[];

  //*ProductOrderInterest
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  interests?: number[];

  //*ProductOrderEthnicity
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  ethnicities?: number[];

  //*ProductOrderStruggle
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { each: true },
  )
  @IsPositive({ each: true })
  struggles?: number[];

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @IsEnum(FinanceStatus)
  @IsOptional()
  financeStatus?: FinanceStatus;
}

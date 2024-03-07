import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums';
import { FinanceStatus } from 'src/core/campaign/enums/finance-status.enum';

export class FindByIdsDto {
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @Transform(({ value }) => value.map((id) => parseInt(id)))
  ids?: number[];

  @IsEnum(FinanceStatus)
  @IsOptional()
  financeStatus?: FinanceStatus;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  userStatus?: number[];

  @IsNumber()
  @IsOptional()
  followerCount?: number;

  @IsNumber()
  @IsOptional()
  postCount?: number;

  @IsNumber()
  @IsOptional()
  bio?: number;
}

import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['name'] as const),
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}

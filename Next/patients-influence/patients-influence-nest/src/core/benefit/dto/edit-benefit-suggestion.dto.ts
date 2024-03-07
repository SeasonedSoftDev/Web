import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateBenefitSuggestionDto } from './create-benefit-suggestion.dto';

export class EditBenefitSuggestionDto extends PartialType(
  CreateBenefitSuggestionDto,
) {
  @IsString()
  @IsOptional()
  statusDescription?: string;

  @IsBoolean()
  @IsOptional()
  isApproved?: boolean;
}

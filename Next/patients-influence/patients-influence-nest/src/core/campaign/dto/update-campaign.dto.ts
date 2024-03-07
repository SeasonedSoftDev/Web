import { PartialType } from '@nestjs/swagger';
import { CreateCampaignDto } from './create-campaign.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  /* @IsBoolean()
  @IsOptional()
  isContractApproved?: boolean; */

  @IsNumber()
  @IsOptional()
  status?: number;
}

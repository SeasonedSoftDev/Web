import { IsString, IsUrl } from 'class-validator';

export class CreateBenefitSuggestionDto {
  @IsString()
  partnershipName: string;

  @IsUrl()
  partnershipLink: string;

  @IsString()
  argumentDescription: string;

  @IsString()
  outcomeDescription: string;
}

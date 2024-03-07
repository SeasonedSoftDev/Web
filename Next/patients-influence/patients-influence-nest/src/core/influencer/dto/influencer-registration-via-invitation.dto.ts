import { IsNotEmpty, IsString } from 'class-validator';
import { InfluencerRegistrationDto } from './influencer-registration.dto';

export class InfluencerRegistrationViaInvitationDto extends InfluencerRegistrationDto {
  @IsString()
  @IsNotEmpty()
  affiliateCode: string;
}

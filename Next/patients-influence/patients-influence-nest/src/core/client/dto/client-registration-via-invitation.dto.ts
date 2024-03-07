import { IsNotEmpty, IsString } from 'class-validator';
import { ClientRegistrationDto } from './client-registration.dto';

export class ClientRegistrationViaInvitationDto extends ClientRegistrationDto {
  @IsString()
  @IsNotEmpty()
  affiliateCode: string;
}

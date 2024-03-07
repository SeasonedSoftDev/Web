import { IsEnum, IsOptional, Matches } from 'class-validator';
import { UserStatus, passwordRegex } from 'src/utils';
import { UpdateDiscoverClientDto } from './update-discover-client.dto';

export class UpdateClientDto extends UpdateDiscoverClientDto {
  @IsOptional()
  @Matches(passwordRegex)
  password?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

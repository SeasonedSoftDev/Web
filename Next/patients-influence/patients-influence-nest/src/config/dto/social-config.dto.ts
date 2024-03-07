import { IsString, IsUrl } from 'class-validator';

export class InstagramEnvironmentVariables {
  @IsString()
  INSTAGRAM_CLIENT_ID: string;

  @IsString()
  INSTAGRAM_CLIENT_SECRET: string;

  @IsString()
  INSTAGRAM_REDIRECT_URI: string;
}

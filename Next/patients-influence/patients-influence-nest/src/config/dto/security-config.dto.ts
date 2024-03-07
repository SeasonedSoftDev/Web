import {
  IsHexadecimal,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SecurityEnvironmentVariables {
  @IsHexadecimal()
  // ? check minimum length
  SECRET_KEY: string;

  @IsString()
  BASE_DOMAIN: string;

  @IsString()
  @IsOptional()
  APP_SUBDOMAIN?: string;

  @IsNumber()
  @Min(10)
  @IsOptional()
  BCRYPT_SALT_ROUNDS?: number;

  @IsString()
  @IsOptional()
  JWT_COOKIE_NAME?: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  RATE_LIMIT_TTL?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  RATE_LIMIT_LIMIT?: number;

  @IsString()
  @IsOptional()
  PROTOCOL?: string;
}

import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

export class AppEnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  API_PORT?: number;

  @IsNumber()
  @Min(1)
  @Max(65535)
  @IsOptional()
  API_SOCKET_PORT?: number;
}

import { IsString } from 'class-validator';

export class AwsEnvironmentVariables {
  @IsString()
  AWS_ACCESS_KEY_ID: string;

  @IsString()
  AWS_SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_S3_BUCKET_NAME: string;

  @IsString()
  AWS_S3_REGION: string;
}

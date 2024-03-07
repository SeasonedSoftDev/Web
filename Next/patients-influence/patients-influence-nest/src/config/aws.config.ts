import { registerAs } from '@nestjs/config';
import { AwsEnvironmentVariables } from './dto/aws-config.dto';
import { IAwsConfig } from './interfaces/aws-config.interface';
import { validate } from './utils/env-validation';

export default registerAs('aws', (): IAwsConfig => {
  validate(process.env, AwsEnvironmentVariables);

  return {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    storageS3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      region: process.env.AWS_S3_REGION,
    },
  };
});

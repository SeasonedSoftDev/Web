import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectAclCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from 'src/config/aws.config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name);
  private readonly s3: S3Client;

  constructor(
    @Inject(awsConfig.KEY)
    private readonly config: ConfigType<typeof awsConfig>,
  ) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.storageS3.region,
    });
  }
  async getPresignedUrl(fileKey: string) {
    try {
      const signedUrl = await getSignedUrl(
        this.s3,
        new GetObjectCommand({
          Bucket: this.config.storageS3.bucketName,
          Key: fileKey,
        }),
        {
          expiresIn: 60 * 5,
        },
      );
      return signedUrl;
    } catch (error) {
      console.error(error);
    }
  }

  async uploadFile(dataBuffer: Buffer, filename: string, type: string) {
    const date = new Date();

    const key = `${date.toISOString().slice(0, 7)}/${uuid()}-${filename}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.config.storageS3.bucketName,
        Body: dataBuffer,
        Key: key,
        ContentDisposition: 'inline',
        ContentType: type,
      });

      await this.s3.send(command);

      this.logger.log(`New file uploaded: ${filename}`);

      return {
        key,
        url: `https://${this.config.storageS3.bucketName}.s3.${this.config.storageS3.region}.amazonaws.com/${key}`,
      };
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  async deleteFile(fileKey: string) {
    try {
      const commnad = new DeleteObjectCommand({
        Bucket: this.config.storageS3.bucketName,
        Key: fileKey,
      });

      const result = await this.s3.send(commnad);

      this.logger.log(`File deleted: ${fileKey}`);

      return result;
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}

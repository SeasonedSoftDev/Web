export interface IAwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  storageS3: {
    bucketName: string;
    region: string;
  };
}

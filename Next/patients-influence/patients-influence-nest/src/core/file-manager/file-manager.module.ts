import { Module } from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { FileManagerController } from './file-manager.controller';
import { AwsS3Module } from 'src/integrations/aws-s3/aws-s3.module';

@Module({
  imports: [AwsS3Module],
  controllers: [FileManagerController],
  providers: [FileManagerService],
})
export class FileManagerModule {}

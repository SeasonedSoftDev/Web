import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { AwsS3Service } from 'src/integrations/aws-s3/aws-s3.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';

@Injectable()
export class FileManagerService {
  private readonly logger = new Logger(FileManagerService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  async upload(file: Express.Multer.File, { name: customName }: UploadFileDto) {
    const name = customName || file.originalname;
    const { url, key } = await this.awsS3Service.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    const fileSaved = await this.prismaService.file.create({
      data: {
        url,
        key,
        filename: file.originalname,
        name,
      },
    });

    this.logger.log(`File "${name}" uploaded at ${url}`);

    return fileSaved;
  }

  async findOne(fileKey: string) {
    return this.awsS3Service.getPresignedUrl(fileKey);
  }

  async find({ skip, take, sortBy, search }: FilterParamsDto) {
    const queryWhere: Prisma.FileWhereInput = search && {
      OR: {
        name: { contains: search, mode: 'insensitive' },
        filename: { contains: search, mode: 'insensitive' },
      },
    };
    const queryOrderBy: Prisma.Enumerable<Prisma.FileOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    return await filterRecordsFactory(this.prismaService, (tx) => tx.file, {
      where: queryWhere,
      skip,
      take,
      orderBy: queryOrderBy,
    })();
  }

  async delete(id: number) {
    const file = await this.prismaService.file.delete({
      where: { id },
    });

    await this.awsS3Service.deleteFile(file.key);

    this.logger.log(`File "${file.name}" (${id}) deleted`);

    return file;
  }
}

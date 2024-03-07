import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';
import { FileManagerService } from './file-manager.service';
import { ApiFile } from './decorators/api-file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CheckAbilities } from '../auth/ability/decorators/ability.decorator';
import { Action } from '../auth/ability';
import { UploadFileDto } from './dto/upload-file.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { FilePaginationEntity } from './entities/file-pagination.entity';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { FileEntity } from './entities/file.entity';

@ApiTags('file manager')
@Controller('fileManager')
export class FileManagerController {
  constructor(private readonly fileManagerService: FileManagerService) {}

  @Post('upload')
  @ApiFile('file', true)
  @UseInterceptors(FileInterceptor('file'))
  @CheckAbilities(
    { action: Action.Create, subject: 'Campaign' },
    { action: Action.Update, subject: 'Campaign' },
  )
  async uploadFile(
    @Body() { name }: UploadFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 25 }),
          new FileTypeValidator({
            // * allow image, video, and pdf mimetypes
            fileType:
              /((^image)(\/)[a-zA-Z0-9_]*)|((^video)(\/)[a-zA-Z0-9_]*)|application\/pdf/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return new FileEntity(await this.fileManagerService.upload(file, { name }));
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  @ApiOkResponse({
    type: FilePaginationEntity,
  })
  @NoAutoSerialize()
  find(@Query() filterParamsDto: FilterParamsDto) {
    return serializePaginationResult(
      this.fileManagerService.find(filterParamsDto),
      FileEntity,
    );
  }

  @Delete(':id')
  // @CheckAbilities({ action: Action.Delete, subject: 'Campaign' })
  async deleteFile(@Param('id') id: number) {
    return new FileEntity(await this.fileManagerService.delete(id));
  }

  @Get(':folder/:id')
  // @CheckAbilities({ action: Action.Read, subject: 'Campaign' })
  async findOne(@Param('id') id: string, @Param('folder') folder: string) {
    return await this.fileManagerService.findOne(`${folder}/${id}`);
  }
}

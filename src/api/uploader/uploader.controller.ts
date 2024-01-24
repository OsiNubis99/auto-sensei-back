import { BasicRequest } from '@common/decorators/basic-request';
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { UploaderDto } from './dto/uploader.dto';
import { UploaderService } from './uploader.service';

@ApiTags('Uploader')
@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 80 * 1024 * 1024 },
    }),
  )
  @Post('/create')
  @BasicRequest({
    description: 'Upload a new file to AWS',
    response: 'Bucket url',
  })
  async create(
    @Body() uploaderDto: UploaderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new HttpException(
        'BAD_REQUEST: File invalid',
        HttpStatus.BAD_REQUEST,
      );
    return await this.uploaderService.create(uploaderDto, file);
  }
}

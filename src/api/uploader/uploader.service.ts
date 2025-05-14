import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UploaderDto } from './dto/uploader.dto';

import { MineTypes } from '@common/enums/mine-types.enums';
import AWSService from '@common/services/aws.service';

@Injectable()
export class UploaderService {
  constructor(private awsService: AWSService) {}

  async create(body: UploaderDto, file: Express.Multer.File) {
    if (!MineTypes[file.mimetype]) {
      throw new HttpException(
        'BAD_REQUEST: file is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const name = Date.now();
    const url = await this.awsService.upload(
      body.location.replace(' ', ''),
      name + '.' + MineTypes[file.mimetype],
      file.buffer,
      file.mimetype,
    );

    return url;
  }
}

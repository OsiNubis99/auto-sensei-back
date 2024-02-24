import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UploaderDto } from './dto/uploader.dto';

import { MineTypes } from '@common/enums/mine-types.enums';
import AWSService from '@common/services/aws.service';

@Injectable()
export class UploaderService {
  constructor(private awsService: AWSService) {}

  async create(body: UploaderDto, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop().toLocaleLowerCase();
    if (!MineTypes[ext]) {
      throw new HttpException(
        'BAD_REQUEST: file is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const name = Date.now();
    const url = await this.awsService.upload(
      body.location.replace(' ', ''),
      name + '.' + ext,
      file.buffer,
    );

    return url;
  }
}

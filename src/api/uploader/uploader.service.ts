import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UploaderDto } from './dto/uploader.dto';

import { MineTypes } from '@common/enums/mine-types.enums';

import AWSService from 'src/common/aws/service';

@Injectable()
export class UploaderService {
  constructor(private awsService: AWSService) {}

  async create(body: UploaderDto, file: Express.Multer.File) {
    const extAvailable = Object.keys(MineTypes).map((item) => '.' + item);
    const ext = '.' + file.originalname.split('.').pop();
    if (extAvailable.indexOf(ext.toLocaleLowerCase()) < 0)
      throw new HttpException(
        'BAD_REQUEST: file is invalid',
        HttpStatus.BAD_REQUEST,
      );

    const name = body.name;
    const url = await this.awsService.upload(
      body.location,
      name + ext,
      file.buffer,
    );

    return url;
  }
}

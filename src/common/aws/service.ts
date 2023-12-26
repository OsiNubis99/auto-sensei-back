import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { MineTypes } from '@common/enums/mine-types.enums';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AWSService {
  private _s3: S3Client;
  private _bucket: string;

  constructor(configService: ConfigService) {
    this._s3 = new S3Client({ region: 'us-east-1' });
    this._bucket = configService.get('aws.bucket');
  }

  public async upload(folder: string, name: string, data: Buffer) {
    try {
      const buffer = data;
      const key = folder + '/' + name;
      const resp = await this._s3.send(
        new PutObjectCommand({
          ContentType: MineTypes[name.split('.').pop()],
          Bucket: this._bucket,
          Key: key,
          Body: buffer,
        }),
      );
      if (resp) {
        return key;
      }
    } catch (err) {
      throw new HttpException('BAD_REQUEST: AWS Fail', HttpStatus.BAD_REQUEST);
    }
  }
}

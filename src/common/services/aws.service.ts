import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MineTypes } from '@common/enums/mine-types.enums';
import { Either } from '@common/generics/either';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AWSService {
  private _s3: S3Client;
  private _bucket: string;

  constructor(private configService: ConfigService) {
    this._s3 = new S3Client({ region: 'us-east-1' });
    this._bucket = this.configService.get('aws.bucket');
  }

  public async upload(folder: string, name: string, data: Buffer) {
    try {
      const buffer = data;
      const key = 'autosensei/' + folder + '/' + name;
      const resp = await this._s3.send(
        new PutObjectCommand({
          ContentType: MineTypes[name.split('.').pop()],
          Bucket: this._bucket,
          Key: key,
          Body: buffer,
        }),
      );
      if (resp) {
        return Either.makeRight(key);
      }
    } catch (err) {
      Logger.error(err);
      return Either.makeLeft(
        new HttpException('BAD_REQUEST: AWS Fail', HttpStatus.BAD_REQUEST),
      );
    }
  }
}

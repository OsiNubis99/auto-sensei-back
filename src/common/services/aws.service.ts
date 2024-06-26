import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Either } from '@common/generics/either';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AWSService {
  private _s3: S3Client;
  private _bucket: string;

  constructor(private configService: ConfigService) {
    this._s3 = new S3Client({ region: 'us-east-2' });
    this._bucket = this.configService.get('aws.bucket');
  }

  public async upload(
    folder: string,
    name: string,
    data: Buffer,
    minetype?: string,
  ) {
    try {
      const buffer = data;
      const key =
        this.configService.get('server.nodeEnv') + '/' + folder + '/' + name;
      const resp = await this._s3.send(
        new PutObjectCommand({
          ACL: 'public-read',
          ContentType: minetype,
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

// import { Either } from '@common/generics/either';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import axios from 'axios';
// import * as CryptoJS from 'crypto-js';
//
// import {
//   TrimOptions,
//   VehicleDetailsI,
// } from '@database/interfaces/vehicle-details.interface';
// import { DriveTrainEnum } from '@common/enums/drive-train.enum';

@Injectable()
export default class VinDecoderService {
  private readonly host: string;
  private readonly url: string;
  private readonly appId: string;
  private readonly secret: string;

  constructor(configService: ConfigService) {
    this.host = configService.get('server.backUrl');
    this.url = configService.get('decoded-vin.url');
    this.appId = configService.get('decoded-vin.appId');
    this.secret = configService.get('decoded-vin.secret');
  }

  // async getCarData(vin: string) {
  //   const date = Date.now().toString();
  //   const nonce = 'asd' + date;
  //   const secretDigestUnencrypted = nonce + date + this.secret;
  //   const secretDigest = CryptoJS.SHA1(secretDigestUnencrypted).toString(
  //     CryptoJS.enc.Base64,
  //   );
  //
  //   const Authorization =
  //     'Atmosphere realm="' +
  //     this.host +
  //     '",chromedata_app_id="' +
  //     this.appId +
  //     '",chromedata_nonce="' +
  //     nonce +
  //     '",chromedata_secret_digest="' +
  //     secretDigest +
  //     '",chromedata_digest_method="SHA1",chromedata_version="1.0",chromedata_timestamp="' +
  //     date +
  //     '"';
  //
  //   try {
  //     const { data } = await axios
  //       .get(this.url + vin, {
  //         headers: { Authorization },
  //       })
  //       .catch((err) => err);
  //
  //     if (!data) return Either.makeLeft(new Error('Api error'));
  //
  //     const result = data.result || {};
  //
  //     let transmission: string = undefined;
  //     let cylinder: string = undefined;
  //
  //     for (const feature of result.features) {
  //       if (feature.description == 'Engine Cylinders') {
  //         cylinder = feature.name;
  //       }
  //       if (feature.description == 'Transmission') {
  //         transmission = feature.name;
  //       }
  //     }
  //
  //     const trimOptions = result.vehicles?.map(
  //       (item) =>
  //         <TrimOptions>{
  //           trim: item.styleDescription || item.trim || '',
  //           doors: item.doors || '',
  //           driveTrain: DriveTrainEnum[item.driveType + ''],
  //           bodyType: item.bodyType || '',
  //         },
  //     ) || [
  //       <TrimOptions>{
  //         trim: '',
  //         doors: '',
  //         driveTrain: DriveTrainEnum.AWD,
  //         bodyType: '',
  //       },
  //     ];
  //
  //     return Either.makeRight(<VehicleDetailsI>{
  //       vin,
  //       year: result.year,
  //       basePrice: 100,
  //       make: result.make,
  //       model: result.model,
  //       transmission,
  //       cylinder,
  //       suggestedPrice: 100,
  //
  //       trimOptions,
  //       ...trimOptions[0],
  //     });
  //   } catch (err) {
  //     return Either.makeLeft(new Error('Vin is invalid'));
  //   }
  // }
}

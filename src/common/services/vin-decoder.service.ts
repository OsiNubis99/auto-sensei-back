import { Either } from '@common/generics/either';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';

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

  async getCarData(vin: string) {
    const date = Date.now().toString();
    const nonce = 'asd' + date;
    const secretDigestUnencrypted = nonce + date + this.secret;
    const secretDigest = CryptoJS.SHA1(secretDigestUnencrypted).toString(
      CryptoJS.enc.Base64,
    );

    const Authorization =
      'Atmosphere realm="' +
      this.host +
      '",chromedata_app_id="' +
      this.appId +
      '",chromedata_nonce="' +
      nonce +
      '",chromedata_secret_digest="' +
      secretDigest +
      '",chromedata_digest_method="SHA1",chromedata_version="1.0",chromedata_timestamp="' +
      date +
      '"';

    try {
      const { data } = await axios
        .get(this.url + vin, {
          headers: { Authorization },
        })
        .catch((err) => err);

      if (!data) return Either.makeLeft(new Error('Api error'));

      const result = data.result || {};

      return Either.makeRight(<VehicleDetailsI>{
        vin,
        year: result.year,
        basePrice: 100,
        make: result.make,
        model: result.model,
        bodyType: result.vehicles ? result.vehicles[0]?.driveType : '',
        doors: result.vehicles ? result.vehicles[0]?.doors : '',
        transmission: result.vehicles ? result.vehicles[0]?.bodyType : '',
        trim: result.vehicles ? result.vehicles[0]?.trim : '',

        suggestedPrice: data.price?.baseMsrp,
        cylinder: data.engine?.cylinder,
      });
    } catch (err) {
      return Either.makeLeft(new Error('Vin is invalid'));
    }
  }
}

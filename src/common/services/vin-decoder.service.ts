import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

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
    try {
      const date = Date.now();
      const noonce = 'asd' + date;

      const Authorization =
        'Atmosphere ' +
        'realm="' +
        this.host +
        '",chromedata_app_id="' +
        this.appId +
        '",chromedata_noonce="' +
        noonce +
        '",chromedata_secret_digest="' +
        crypto
          .createHash('sha256')
          .update(noonce + date + this.secret)
          .digest('hex') +
        '",chromedata_signature_method="SHA1",chromedata_timestamp="' +
        date +
        '"';
      return await axios
        .get(this.url + vin, {
          headers: { Authorization },
        })
        .catch((err) => err);

      // if (data.errorType) return Either.makeLeft(new Error(data.message));

      // return Either.makeRight(<VehicleDetailsI>{
      //   vin,
      //   year: data.years?.shift()?.year,
      //   basePrice: 100,
      //   suggestedPrice: data.price?.baseMsrp,
      //   make: data.make?.name,
      //   model: data.model?.name,
      //   trim: data.years?.shift()?.styles?.shift()?.trim,
      //   bodyType: data.categories?.primaryBodyType,
      //   cylinder: data.engine?.cylinder,
      //   transmission: data.transmission?.name,
      //   doors: data.numOfDoors,
      // });
    } catch (err) {
      return err;
    }
  }
}

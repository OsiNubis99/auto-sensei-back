import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { Either } from '@common/generics/either';
import { VehicleDetailsI } from '@database/interfaces/vehicle-details.interface';

@Injectable()
export default class VinApiService {
  private readonly url: string;
  private readonly token: string;

  constructor(configService: ConfigService) {
    this.url = configService.get('vin.url');
    this.token = configService.get('vin.token');
  }

  async getCarData(vin: string) {
    try {
      const { data } = await axios.get(this.url + vin, {
        headers: { Authorization: 'Bearer ' + this.token },
      });

      if (data.errorType) return Either.makeLeft(new Error(data.message));

      return Either.makeRight(<VehicleDetailsI>{
        trimOptions: [],
        vin,
        year: data.years?.shift()?.year,
        basePrice: 100,
        suggestedPrice: data.price?.baseMsrp,
        make: data.make?.name,
        model: data.model?.name,
        trim: data.years?.shift()?.styles?.shift()?.trim,
        bodyType: data.categories?.primaryBodyType,
        cylinder: data.engine?.cylinder,
        transmission: data.transmission?.name,
        doors: data.numOfDoors,
      });
    } catch (err) {
      return Either.makeLeft(new Error('Vin is invalid'));
    }
  }
}

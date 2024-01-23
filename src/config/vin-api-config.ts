import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { VinApiConfigI } from './interface/vin-api-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const VinApiConfig = registerAs('vin', () => {
  const configs: JoiConfig<VinApiConfigI> = {
    url: {
      value: process.env.VIN_URL,
      joi: Joi.string().required(),
    },
    token: {
      value: process.env.VIN_TOKEN,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

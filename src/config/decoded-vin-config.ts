import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { DecodedVinConfigI } from './interface/decoded-vin.interface';

import JoiUtil, { JoiConfig } from './util/joi';

export const DecodedVinConfig = registerAs('decoded-vin', () => {
  const configs: JoiConfig<DecodedVinConfigI> = {
    url: {
      value: process.env.DECODED_VIN_URL,
      joi: Joi.string().required(),
    },
    appId: {
      value: process.env.DECODED_VIN_APP_ID,
      joi: Joi.string().required(),
    },
    secret: {
      value: process.env.DECODED_VIN_SECRET,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

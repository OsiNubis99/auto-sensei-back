import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { StripeConfigI } from './interface/stripe-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const StripeConfig = registerAs('stripe', (): StripeConfigI => {
  const configs: JoiConfig<StripeConfigI> = {
    key: {
      value: process.env.STRIPE_KEY,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { TwilioConfigI } from './interface/twilio-config.interface';

import JoiUtil, { JoiConfig } from './util/joi';

export const MailerConfig = registerAs('twilio', (): TwilioConfigI => {
  const configs: JoiConfig<TwilioConfigI> = {
    accountSID: {
      value: process.env.TWILIO_ACCOUNT_SID,
      joi: Joi.string().required(),
    },
    authToken: {
      value: process.env.TWILIO_AUTH_TOKEN,
      joi: Joi.string().required(),
    },
    number: {
      value: process.env.TWILIO_NUMBER,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { MailerConfigI } from './interface/mailer-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const MailerConfig = registerAs('mailer', (): MailerConfigI => {
  const configs: JoiConfig<MailerConfigI> = {
    host: {
      value: process.env.MAILDEV_HOST,
      joi: Joi.string().required(),
    },
    port: {
      value: process.env.MAILDEV_PORT,
      joi: Joi.number().required(),
    },
    user: {
      value: process.env.MAILDEV_USER,
      joi: Joi.string().required(),
    },
    pass: {
      value: process.env.MAILDEV_PASS,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

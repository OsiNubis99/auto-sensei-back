import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseConfigI } from './interface/database-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const DatabaseConfig = registerAs('database', (): DatabaseConfigI => {
  const configs: JoiConfig<DatabaseConfigI> = {
    uri: {
      value: process.env.MONGODB_URI,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

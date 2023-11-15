import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { IDatabaseConfig } from './interface/database-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const DatabaseConfig = registerAs('database', (): IDatabaseConfig => {
  const configs: JoiConfig<IDatabaseConfig> = {
    uri: {
      value: process.env.MONGODB_URI,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

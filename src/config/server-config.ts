import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { IServerConfig } from './interface/server-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const ServerConfig = registerAs('server', (): IServerConfig => {
  const configs: JoiConfig<IServerConfig> = {
    nodeEnv: {
      value: process.env.NODE_ENV,
      joi: Joi.string().required().valid('development', 'production'),
    },
    port: {
      value: process.env.SERVER_PORT,
      joi: Joi.number().required(),
    },
    frontUrl: {
      value: process.env.FRONT_URL,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import { AWSConfigI } from './interface/aws-config.interface';
import JoiUtil, { JoiConfig } from './util/joi';

export const AWSConfig = registerAs('aws', (): AWSConfigI => {
  const configs: JoiConfig<AWSConfigI> = {
    bucket: {
      value: process.env.AWS_BUCKET,
      joi: Joi.string().required(),
    },
  };

  return JoiUtil.validate(configs);
});

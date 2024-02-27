import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';

export type PhoneCodeDocument = HydratedDocument<PhoneCode>;

@Schema({ timestamps: true })
export class PhoneCode {
  @Prop({
    enum: StatusEnum,
    default: StatusEnum.inactive,
  })
  status: StatusEnum;

  @Prop({
    unique: true,
  })
  phone: string;

  @Prop()
  code: string;
}

export const PhoneCodeSchema = SchemaFactory.createForClass(PhoneCode);

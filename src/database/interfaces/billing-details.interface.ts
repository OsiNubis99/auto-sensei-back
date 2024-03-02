import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AddressI } from './address.interface';

@Schema({ _id: false })
export class BillingDetailsI {
  @Prop({ type: SchemaFactory.createForClass(AddressI) })
  address: AddressI;

  @Prop()
  name: string;

  @Prop()
  email?: string;
}

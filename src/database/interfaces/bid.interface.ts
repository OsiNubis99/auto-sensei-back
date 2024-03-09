import { Prop, Schema } from '@nestjs/mongoose';
import { Schema as Schemas } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';
import {
  PaymentMethod,
  PaymentMethodDocument,
} from '@database/schemas/payment-method.schema';

@Schema({ _id: false, timestamps: true })
export class BidI {
  @Prop()
  amount: number;

  @Prop({ type: Schemas.Types.ObjectId, ref: User.name })
  participant: UserDocument;

  @Prop({ type: Schemas.Types.ObjectId, ref: PaymentMethod.name })
  paymentMethod: PaymentMethodDocument;

  @Prop()
  biddingLimit?: number;

  @Prop()
  automatic?: boolean;
}

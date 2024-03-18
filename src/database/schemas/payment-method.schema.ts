import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BillingDetailsI } from '@database/interfaces/billing-details.interface';
import { CardI } from '@database/interfaces/card.interface';

export type PaymentMethodDocument = HydratedDocument<PaymentMethod>;

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop()
  stripePaymentId: string;

  @Prop({ type: SchemaFactory.createForClass(BillingDetailsI) })
  billingDetails: BillingDetailsI;

  @Prop({ type: SchemaFactory.createForClass(CardI) })
  card: CardI;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

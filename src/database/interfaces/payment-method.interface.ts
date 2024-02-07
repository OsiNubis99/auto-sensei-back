import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CardDto } from '@common/dtos/card.dto';
import { BillingDetailsI } from './billing-details.interface';
import { CardI } from './card.interface';

@Schema({ timestamps: true })
export class PaymentMethodI {
  @Prop()
  stripePaymentId: string;

  @Prop({ type: SchemaFactory.createForClass(BillingDetailsI) })
  billingDetails: BillingDetailsI;

  @Prop({ type: SchemaFactory.createForClass(CardI) })
  card: CardI;

  @Prop({ type: SchemaFactory.createForClass(CardDto), select: false })
  cardDto: CardDto;
}

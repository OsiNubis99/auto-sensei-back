import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CardI {
  @Prop()
  last4: string;

  @Prop()
  exp_month: number;

  @Prop()
  exp_year: number;

  @Prop()
  brand: string;
}

import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class AddressI {
  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  line1?: string;

  @Prop()
  line2?: string;

  @Prop()
  postal_code: string;

  @Prop()
  state: string;
}

import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class DealerI {
  @Prop()
  picture: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  name: string;

  @Prop()
  omvic: string;

  @Prop({ default: false })
  phoneValidated?: boolean;

  @Prop()
  phone?: string;
}

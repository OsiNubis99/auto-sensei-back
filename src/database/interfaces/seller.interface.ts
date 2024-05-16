import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false, timestamps: false })
export class SellerI {
  @Prop()
  picture: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  driverLicense: string;

  @Prop({ default: false })
  phoneValidated?: boolean;

  @Prop()
  phone?: string;
}

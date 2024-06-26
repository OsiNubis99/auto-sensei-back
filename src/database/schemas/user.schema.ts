import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

import { UserTypeEnum } from '@common/enums/user-type.enum';

import { StatusEnum } from '@common/enums/status.enum';
import { AddressI } from '@database/interfaces/address.interface';
import { DealerI } from '@database/interfaces/dealer.interface';
import { SellerI } from '@database/interfaces/seller.interface';

import { PaymentMethod, PaymentMethodDocument } from './payment-method.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  customerId: string;

  @Prop({
    enum: UserTypeEnum,
    default: UserTypeEnum.seller,
  })
  type: UserTypeEnum;

  @Prop({
    enum: StatusEnum,
    default: StatusEnum.inactive,
  })
  status: StatusEnum;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: SchemaFactory.createForClass(DealerI) })
  dealer: DealerI;

  @Prop({ type: SchemaFactory.createForClass(SellerI) })
  seller: SellerI;

  @Prop({ type: SchemaFactory.createForClass(AddressI) })
  address: AddressI;

  @Prop({ type: [mongooseSchema.Types.ObjectId], ref: PaymentMethod.name })
  paymentMethods: [PaymentMethodDocument];

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

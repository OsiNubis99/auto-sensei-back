import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { UserTypeEnum } from '@common/enums/user-type.enum';

import { SellerI } from '@database/interfaces/seller.interface';
import { DealerI } from '@database/interfaces/dealer.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    enum: UserTypeEnum,
  })
  type: UserTypeEnum;

  @Prop()
  status: boolean;

  @Prop({
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop()
  dealer: DealerI;

  @Prop()
  seller: SellerI;

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

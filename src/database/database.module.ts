import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

import { Auction, AuctionSchema } from './schemas/auction.schema';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { EmailCode, EmailCodeSchema } from './schemas/email-code.schema';
import { Faq, FaqSchema } from './schemas/faq.schema';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from './schemas/payment-method.schema';
import { PhoneCode, PhoneCodeSchema } from './schemas/phone-code.schema';
import { User, UserSchema } from './schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Auction.name,
        useFactory: async (connection: Connection) => {
          const schema = AuctionSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'serial',
            inc_field: 'serial',
            disable_hooks: true,
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    MongooseModule.forFeature([
      { name: EmailCode.name, schema: EmailCodeSchema },
    ]),
    MongooseModule.forFeature([{ name: Faq.name, schema: FaqSchema }]),
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: PaymentMethodSchema },
    ]),
    MongooseModule.forFeature([
      { name: PhoneCode.name, schema: PhoneCodeSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}

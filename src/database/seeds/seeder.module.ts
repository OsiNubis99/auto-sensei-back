import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabaseConfig } from '../../config/database-config';
import { User, UserSchema } from '../schemas/user.schema';
import { AdminSeeder } from './admin.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DatabaseConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AdminSeeder],
})
export class SeederModule {}

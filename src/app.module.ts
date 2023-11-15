import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { CommonModule } from './common/common.module';
import { DatabaseConfig } from './config/database-config';
import { JWTConfig } from './config/jwt-config';
import { ServerConfig } from './config/server-config';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    ApiModule,
    CommonModule,
    ConfigModule.forRoot({
      load: [DatabaseConfig, JWTConfig, ServerConfig],
      isGlobal: true,
    }),
    GraphqlModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

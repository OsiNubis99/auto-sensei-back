import { Module } from '@nestjs/common';

import { MessageModule } from './message/message.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [SocketGateway, MessageModule],
})
export class SocketModule {}

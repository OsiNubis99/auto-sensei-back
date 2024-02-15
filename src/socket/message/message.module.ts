import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';
import { CreateMessageService } from './service/create-message.service';

@Module({
  imports: [CommonModule],
  providers: [MessageGateway, MessageService, CreateMessageService],
})
export class MessageModule {}

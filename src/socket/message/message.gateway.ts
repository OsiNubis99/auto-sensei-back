import { Logger, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isValidObjectId, Model } from 'mongoose';
import { Server } from 'socket.io';

import { MessageReasonEnum } from '@common/enums/message-reason.enum';
import { EitherGatewayInterceptor } from '@common/interceptor/either-gateway.interceptor';
import { ChatDocument } from '@database/schemas/chat.schema';
import { User } from '@database/schemas/user.schema';

import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get_messages.dto';
import { MessageService } from './message.service';
import { CreateMessageService } from './service/create-message.service';

@WebSocketGateway({
  namespace: 'message',
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    private readonly createMessageService: CreateMessageService,
    private readonly messageService: MessageService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  @WebSocketServer()
  private server: Server;
  private wsClients = [];

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  async handleConnection(client) {
    const {
      id,
      handshake: { auth },
    } = client;
    if (auth.userId && isValidObjectId(auth.userId)) {
      const user = await this.userModel.findById(auth.userId);
      if (user) {
        this.wsClients.push({ id, userId: auth.userId, client });
        return 'Connection successful for id: ' + auth.userId;
      }
    }
    client.disconnect(true);
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i].id === client.id) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  broadcast(userId: string, message: ChatDocument, reason: MessageReasonEnum) {
    for (const c of this.wsClients) {
      if (c.userId == userId) {
        try {
          c.client.emit(reason, message);
        } catch (err) {
          Logger.error(err);
        }
      }
    }
  }

  @UseInterceptors(EitherGatewayInterceptor)
  @SubscribeMessage('createMessage')
  async create(client, data: CreateMessageDto) {
    const userId = client?.handshake?.auth?.userId;
    if (userId) {
      const messageResponse = await this.createMessageService.execute({
        ...data,
        userId,
      });
      if (messageResponse.isLeft()) {
        return messageResponse;
      }
      const message = messageResponse.getRight();
      this.broadcast(
        message.participant._id.equals(userId)
          ? message.auction.owner._id.toString()
          : message.participant._id.toString(),
        message,
        MessageReasonEnum.newMessageReceived,
      );
      this.broadcast(userId, message, MessageReasonEnum.newMessageSended);
      return messageResponse;
    }
  }

  @UseInterceptors(EitherGatewayInterceptor)
  @SubscribeMessage('getMessages')
  findAll(client, data: GetMessagesDto) {
    const userId = client?.handshake?.auth?.userId;
    if (userId) return this.messageService.getChat(userId, data);
  }

  @UseInterceptors(EitherGatewayInterceptor)
  @SubscribeMessage('getChats')
  getChats(client) {
    const userId = client?.handshake?.auth?.userId;
    if (userId) return this.messageService.getChats(userId);
  }
}

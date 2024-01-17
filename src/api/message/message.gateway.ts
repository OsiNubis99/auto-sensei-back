import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { ChatDocument } from '@database/schemas/chat.schema';

import { CreateMessageDto } from './dto/create-message.dto';
import { GetChatsDto } from './dto/get_chats.dto';
import { GetMessagesDto } from './dto/get_messages.dto';
import { MessageService } from './message.service';

enum Reasons {
  newMessageSended = 'newMessageSended',
  newMessageRecived = 'newMessageReceived',
}

@WebSocketGateway({
  namespace: 'message',
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer()
  private server: Server;
  private wsClients = [];

  afterInit() {
    this.server.emit('testing', { do: 'stuff' });
  }

  handleConnection(client) {
    const {
      id,
      handshake: { auth },
    } = client;
    if (auth.userId) {
      this.wsClients.push({ id, userId: auth.userId, client });
      return 'Connection successful for id: ' + auth.userId;
    }
    return 'Headers invalid';
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i].id === client.id) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  broadcast(userId: string, message: ChatDocument, reason: Reasons) {
    for (const c of this.wsClients) {
      if (c.userId == userId) c.client.emit(reason, message);
    }
  }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() body: CreateMessageDto) {
    try {
      const message = await this.messageService.create(body);
      this.broadcast(
        message.participant.id,
        message,
        Reasons.newMessageRecived,
      );
      this.broadcast(
        message.auction.owner.id,
        message,
        Reasons.newMessageSended,
      );
      return message;
    } catch (err) {
      return {
        error: err,
      };
    }
  }

  @SubscribeMessage('getMessages')
  findAll(@MessageBody() body: GetMessagesDto) {
    try {
      return this.messageService.getChat(body);
    } catch (err) {
      return {
        error: err,
      };
    }
  }

  @SubscribeMessage('getChats')
  getChats(@MessageBody() body: GetChatsDto) {
    try {
      return this.messageService.getChats(body);
    } catch (err) {
      return {
        error: err,
      };
    }
  }
}

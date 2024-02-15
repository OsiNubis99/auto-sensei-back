import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { isValidObjectId } from 'mongoose';

import { MessageReasonEnum } from '@common/enums/message-reason.enum';

@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}
  @WebSocketServer()
  private clients = [];

  async handleConnection({ disconnect, id, handshake, emit }) {
    if (handshake.auth.userId && isValidObjectId(handshake.auth.userId)) {
      this.clients.push({ id, userId: handshake.auth.userId, emit });
      return 'Connection successful for id: ' + handshake.auth.userId;
    }
    disconnect(true);
  }

  handleDisconnect({ id }) {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].id === id) {
        this.clients.splice(i, 1);
        break;
      }
    }
  }

  broadcast<T>(data: {
    userId?: string;
    message: T;
    reason: MessageReasonEnum;
  }) {
    for (const client of this.clients) {
      if (!data.userId || client.userId === data.userId) {
        try {
          client.emit(data.reason, data.message);
        } catch (err) {
          Logger.error(err);
        }
      }
    }
  }
}

import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
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
  private clients = [];

  async handleConnection(client) {
    const {
      id,
      handshake: { auth },
    } = client;
    if (auth.userId && isValidObjectId(auth.userId)) {
      this.clients.push({ id, userId: auth.userId, client });
      return 'Connection successful for id: ' + auth.userId;
    }
    client.disconnect(true);
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
          client.client.emit(data.reason, data.message);
        } catch (err) {
          Logger.error(err, 'Socket');
        }
      }
    }
  }
}

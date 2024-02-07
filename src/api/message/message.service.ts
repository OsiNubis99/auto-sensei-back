import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { isValidObjectId, Model } from 'mongoose';

import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/either';
import { Auction } from '@database/schemas/auction.schema';
import { Chat } from '@database/schemas/chat.schema';
import { User } from '@database/schemas/user.schema';

import { GetMessagesDto } from './dto/get_messages.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getChat(userId: string, data: GetMessagesDto) {
    const auctionId = data.chatId?.split('-')[0];
    const participantId = data.chatId?.split('-')[1];

    if (!isValidObjectId(auctionId))
      return Either.makeLeft(new WsException('auction invalid'));
    if (!isValidObjectId(participantId))
      return Either.makeLeft(new WsException('user invalid'));

    const auction = await this.auctionModel.findOne({
      _id: auctionId,
    });
    if (!auction) return Either.makeLeft(new WsException('auction invalid'));

    const user = await this.userModel.findOne({
      _id: participantId,
    });
    if (!user) return Either.makeLeft(new WsException('user invalid'));

    if (!user._id.equals(userId) && !auction.owner._id.equals(userId))
      return Either.makeLeft(new WsException('invalid'));

    return Either.makeRight(
      await this.chatModel.findOne({
        auction,
        participant: user,
      }),
    );
  }

  async getChats(userId: string) {
    if (!isValidObjectId(userId)) {
      throw 'user invalid';
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      return Either.makeLeft(new WsException('user invalid'));
    }
    if (user.type == UserTypeEnum.seller)
      return Either.makeRight(
        await this.chatModel
          .find({})
          .then((chats) =>
            chats.filter((chat) => chat.auction?.owner._id.equals(user._id)),
          ),
      );
    return Either.makeRight(await this.chatModel.find({ participant: user }));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Auction } from '@database/schemas/auction.schema';
import { Chat } from '@database/schemas/chat.schema';
import { User } from '@database/schemas/user.schema';

import { CreateMessageDto } from './dto/create-message.dto';
import { GetChatsDto } from './dto/get_chats.dto';
import { GetMessagesDto } from './dto/get_messages.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(body: CreateMessageDto) {
    const auctionId = body.chatId?.split('-')[0];
    const userId = body.chatId?.split('-')[1];

    if (!isValidObjectId(auctionId)) {
      throw 'auction invalid';
    }
    if (!isValidObjectId(userId)) {
      throw 'user invalid';
    }
    const auction = await this.auctionModel
      .findOne({
        _id: auctionId,
      })
      .populate('owner');
    if (!auction) {
      throw 'auction invalid';
    }
    const participant = await this.userModel.findOne({
      _id: userId,
    });
    if (!participant) {
      throw 'user invalid';
    }

    let chat = await this.chatModel.findOne({
      auction,
      participant,
    });
    if (!chat) {
      chat = new this.chatModel();
      chat.auction = auction;
      chat.participant = participant;
      chat.messages = [];
    }

    let user = participant;
    if (body.userId === auction.owner.id) {
      user = auction.owner;
    }

    chat.messages.unshift({
      message: body.message,
      user,
    });

    return await chat.save();
  }

  async getChat(body: GetMessagesDto) {
    const auctionId = body.chatId?.split('-')[0];
    const userId = body.chatId?.split('-')[1];

    if (!isValidObjectId(auctionId)) {
      throw 'auction invalid';
    }
    if (!isValidObjectId(userId)) {
      throw 'user invalid';
    }
    const auction = await this.auctionModel.findOne({
      _id: auctionId,
    });
    if (!auction) {
      throw 'auction invalid';
    }
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user) {
      throw 'user invalid';
    }
    return this.chatModel
      .findOne({
        auction,
        participant: user,
      })
      .populate('auction.owner', 'participant');
  }

  async getChats(body: GetChatsDto) {
    if (!isValidObjectId(body.userId)) {
      throw 'user invalid';
    }
    const user = await this.userModel.findOne({ _id: body.userId });
    if (!user) {
      throw 'user invalid';
    }
    if (user.type == UserTypeEnum.seller)
      return this.chatModel
        .find({ 'auction.owner': user })
        .populate('auction.owner', 'participant');
    else
      return this.chatModel
        .find({ participant: user })
        .populate('auction.owner', 'participant');
  }
}

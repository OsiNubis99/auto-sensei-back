import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WsException } from '@nestjs/websockets';
import { isValidObjectId, Model } from 'mongoose';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { Auction } from '@database/schemas/auction.schema';
import { Chat, ChatDocument } from '@database/schemas/chat.schema';
import { User } from '@database/schemas/user.schema';

import { CreateMessageDto } from '../dto/create-message.dto';
import AWSService from '@common/services/aws.service';

interface P extends CreateMessageDto {
  userId: string;
}

interface R extends ChatDocument {}

@Injectable()
export class CreateMessageService implements AppServiceI<P, R, WsException> {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(User.name) private userModel: Model<User>,
    private awsService: AWSService,
  ) {}

  async execute({ userId, ...param }: P) {
    const auctionId = param.chatId?.split('-')[0];
    const participantId = param.chatId?.split('-')[1];

    if (!isValidObjectId(auctionId)) {
      return Either.makeLeft(new WsException('auction invalid'));
    }
    if (!isValidObjectId(participantId)) {
      return Either.makeLeft(new WsException('user invalid'));
    }
    const auction = await this.auctionModel
      .findOne({
        _id: auctionId,
      })
      .populate('owner');
    if (!auction) {
      return Either.makeLeft(new WsException('auction invalid'));
    }
    const participant = await this.userModel.findOne({
      _id: participantId,
    });
    if (!participant) {
      return Either.makeLeft(new WsException('user invalid'));
    }

    if (!participant._id.equals(userId) && !auction.owner._id.equals(userId))
      return Either.makeLeft(new WsException('invalid'));

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
    if (userId === auction.owner.id) {
      user = auction.owner;
    }

    Logger.log({ file: param.file });

    const url = await this.awsService.upload(
      `chats/${chat.id}`,
      Date.now().toString() + param.file.originalname,
      param.file.buffer,
    );

    Logger.log({ url });

    chat.messages.unshift({
      message: param.message,
      url: url.isRight() ? url.getRight() : null,
      user,
    });

    return Either.makeRight(await chat.save());
  }
}

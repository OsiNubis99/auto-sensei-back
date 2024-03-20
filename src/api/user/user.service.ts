import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';
import { Either } from '@common/generics/either';
import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findSellers(user: UserDocument) {
    let filter: FilterQuery<User> = {
      type: UserTypeEnum.seller,
    };
    switch (user.type) {
      case UserTypeEnum.dealer:
        filter = {
          type: UserTypeEnum.seller,
          seller: { $exists: true, $ne: null },
          status: StatusEnum.active,
        };
        break;
      case UserTypeEnum.seller:
        filter = {
          _id: user._id,
        };
        break;
    }
    return Either.makeRight(
      await this.userModel.find(filter).sort({ createdAt: 'desc' }),
    );
  }

  async findDealers(user: UserDocument) {
    let filter: FilterQuery<User> = {
      type: UserTypeEnum.dealer,
    };
    switch (user.type) {
      case UserTypeEnum.dealer:
        filter = {
          _id: user._id,
        };
        break;
      case UserTypeEnum.seller:
        filter = {
          type: UserTypeEnum.dealer,
          dealer: { $exists: true, $ne: null },
          status: StatusEnum.active,
        };
        break;
    }
    return Either.makeRight(
      await this.userModel.find(filter).sort({ createdAt: 'desc' }),
    );
  }

  async findOne(filter: FilterQuery<User>) {
    return Either.makeRight(await this.userModel.findOne(filter));
  }

  async delete(filter: FilterQuery<User>) {
    filter.type = { $ne: 0 };
    return Either.makeRight(
      await this.userModel.updateOne(filter, {
        status: StatusEnum.deleted,
      }),
    );
  }
}

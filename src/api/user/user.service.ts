import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';
import { Either } from '@common/generics/Either';
import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';

String;
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<Either<UserDocument[]>> {
    return Either.makeRight(await this.userModel.find());
  }

  async findSellers(): Promise<Either<UserDocument[]>> {
    return Either.makeRight(
      await this.userModel.find({
        type: UserTypeEnum.seller,
        seller: { $exists: true, $ne: null },
        status: StatusEnum.active,
      }),
    );
  }

  async findDealers(): Promise<Either<UserDocument[]>> {
    return Either.makeRight(
      await this.userModel.find({
        type: UserTypeEnum.dealer,
        dealer: { $exists: true, $ne: null },
        status: StatusEnum.active,
      }),
    );
  }

  async findOne(filter: FilterQuery<User>): Promise<Either<UserDocument>> {
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

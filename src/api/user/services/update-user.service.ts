import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { DealerI } from '@database/interfaces/dealer.interface';
import { SellerI } from '@database/interfaces/seller.interface';
import { PhoneCode } from '@database/schemas/phone-code.schema';
import { User, UserDocument } from '@database/schemas/user.schema';

import { UpdateUserDto } from '@api/user/dto/update-user.dto';

type P = UpdateUserDto & {
  user: UserDocument;
};

type R = UserDocument;

@Injectable()
export class UpdateUserService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(PhoneCode.name)
    private phoneCodeModel: Model<PhoneCode>,
  ) {}

  async execute({
    user,
    address,
    password,
    seller,
    dealer,
    phone,
    validationCode,
    ...newData
  }: P) {
    if (
      newData.email &&
      newData.email !== user.email &&
      (await this.userModel.findOne({ email: newData.email }))
    )
      return Either.makeLeft(
        new HttpException('Email already used', HttpStatus.BAD_REQUEST),
      );

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (user.type == UserTypeEnum.dealer && dealer) {
      if (!user.dealer) user.dealer = <DealerI>{};
      for (const key of Object.keys(dealer)) {
        user.dealer[key] = dealer[key];
      }
    }

    if (user.type == UserTypeEnum.seller && seller) {
      if (!user.seller) user.seller = <SellerI>{};
      for (const key of Object.keys(seller)) {
        user.seller[key] = seller[key];
      }
    }

    if (phone) {
      const phoneCode = await this.phoneCodeModel.findOne({
        phone: phone,
      });
      if (!phoneCode || phoneCode.code !== validationCode) {
        return Either.makeLeft(
          new HttpException("Code isn't valid", HttpStatus.BAD_REQUEST),
        );
      }
      if (user.type == UserTypeEnum.dealer) {
        if (!user.dealer) user.dealer = <DealerI>{};
        user.dealer.phone = phone;
      }

      if (user.type == UserTypeEnum.seller) {
        if (!user.seller) user.seller = <SellerI>{};
        user.seller.phone = phone;
      }
    }

    if (address) {
      user.address = address;
    }

    for (const key of Object.keys(newData)) {
      user[key] = newData[key];
    }

    if (user.status === StatusEnum.notvalidated) {
      if (user.type == UserTypeEnum.dealer) user.status = StatusEnum.unaproved;
      if (user.type == UserTypeEnum.seller) user.status = StatusEnum.active;
    }

    try {
      await this.userModel.updateOne({ _id: user._id }, user);
    } catch (err) {
      return Either.makeLeft(
        new HttpException('Bad update', HttpStatus.BAD_REQUEST),
      );
    }

    return Either.makeRight(user);
  }
}

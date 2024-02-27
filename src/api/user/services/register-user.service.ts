import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import { PhoneCode } from '@database/schemas/phone-code.schema';
import { User, UserDocument } from '@database/schemas/user.schema';

import { RegisterUserDto } from '@api/user/dto/register-user.dto';
import { AuthService } from '@auth/auth.service';

interface P extends RegisterUserDto {}

interface R extends UserDocument {}

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class RegisterUserService implements AppServiceI<P, R, HttpException> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(PhoneCode.name)
    private phoneCodeModel: Model<PhoneCode>,
    private authService: AuthService,
  ) {}

  async execute({ isAdmin, seller, dealer, ...param }: P) {
    if (seller && dealer && !isAdmin)
      return Either.makeLeft(
        new HttpException('User only can be 1 type', HttpStatus.BAD_REQUEST),
      );

    const user = new this.userModel();

    if (await this.userModel.findOne({ email: param.email }))
      return Either.makeLeft(
        new HttpException('Email already used', HttpStatus.BAD_REQUEST),
      );
    user.email = param.email;

    if (!regex.test(param.password))
      return Either.makeLeft(
        new HttpException('Pasword should be valid', HttpStatus.BAD_REQUEST),
      );
    user.password = await bcrypt.hash(param.password, 10);

    if (isAdmin) {
      user.type = UserTypeEnum.admin;
    } else {
      const phoneCode = await this.phoneCodeModel.findOne({
        phone: param.phone,
      });
      if (!phoneCode || phoneCode.code !== param.validationCode) {
        return Either.makeLeft(
          new HttpException("Phone isn't valid", HttpStatus.BAD_REQUEST),
        );
      }

      if (seller) {
        user.type = UserTypeEnum.seller;
        user.seller = seller;
        user.seller.phone = param.phone;
      }

      if (dealer) {
        user.type = UserTypeEnum.dealer;
        user.dealer = dealer;
        user.dealer.phone = param.phone;
      }
    }

    await user.save();

    if (user.type == UserTypeEnum.seller || user.type == UserTypeEnum.dealer) {
      user.status = StatusEnum.notvalidated;
      const emailValidation = await this.authService.emailValidation(
        user.email,
      );
      if (emailValidation.isLeft()) {
        return <Either<null, HttpException>>emailValidation;
      }
    } else {
      user.status = StatusEnum.active;
    }

    return Either.makeRight(await user.save());
  }
}

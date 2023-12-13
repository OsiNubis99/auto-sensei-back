import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { JWTPayloadI } from '@auth/jwt.payload';
import { User, UserDocument } from '@database/schemas/user.schema';
import { Either } from '@common/generics/Either';
import { IAppService } from '@common/generics/IAppService';

import { RegisterUserDto } from '@user/dto/register-user.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { ConfigService } from '@nestjs/config';
import { StatusEnum } from '@common/enums/status.enum';

interface P extends RegisterUserDto {}

interface R extends UserDocument {}

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class RegisterUserService implements IAppService<P, R> {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async execute({ isAdmin, seller, dealer, ...param }: P): Promise<Either<R>> {
    if (seller && dealer && !isAdmin)
      return Either.makeLeft('User only can be 1 type', HttpStatus.BAD_REQUEST);

    const user = new this.userModel();

    if (await this.userModel.findOne({ email: param.email }))
      return Either.makeLeft('Email already used', HttpStatus.BAD_REQUEST);
    user.email = param.email;

    if (!regex.test(param.password))
      return Either.makeLeft('Pasword should be valid', HttpStatus.BAD_REQUEST);
    user.password = await bcrypt.hash(param.password, 10);

    if (seller) {
      user.type = UserTypeEnum.seller;
      user.seller = seller;
    }

    if (dealer) {
      user.type = UserTypeEnum.dealer;
      user.dealer = dealer;
    }

    if (isAdmin) {
      user.type = UserTypeEnum.admin;
    }

    const payload: JWTPayloadI = { sub: user.id };

    if (user.type == UserTypeEnum.seller || user.type == UserTypeEnum.dealer) {
      let url = this.config.get('server.frontUrl');
      url += '/signup/';
      if (user.type == UserTypeEnum.seller) url += 'sellers';
      if (user.type == UserTypeEnum.dealer) url += 'dealers';
      url += `?token=${this.jwtService.sign(payload, { expiresIn: '15m' })}`;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'welcome',
        context: {
          url,
          name: user.seller?.firstName || user.dealer?.name || user.email,
        },
      });
    } else {
      user.status = StatusEnum.active;
    }

    return Either.makeRight(await user.save());
  }
}

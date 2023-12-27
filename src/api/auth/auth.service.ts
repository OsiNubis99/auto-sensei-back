import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { User, UserDocument } from '@database/schemas/user.schema';
import { JWTPayloadI } from './jwt.payload';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { StatusEnum } from '@common/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email },
      { password: 1, _id: 1 },
    );
    if (
      user &&
      user.status !== StatusEnum.unaproved &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload: JWTPayloadI = { sub: user.id };
    return Either.makeRight({
      access_token: this.jwtService.sign(payload),
    });
  }

  async emailValidation(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) return Either.makeLeft('User undefined', HttpStatus.BAD_REQUEST);

    const payload: JWTPayloadI = { sub: user.id };

    let url = this.config.get('server.frontUrl');
    url += '/signup/';
    if (user.type == UserTypeEnum.seller) url += 'sellers';
    if (user.type == UserTypeEnum.dealer) url += 'dealers';
    url += `?token=${this.jwtService.sign(payload, { expiresIn: '15m' })}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'welcome',
        context: {
          url,
          name: user.seller?.firstName || user.dealer?.name || user.email,
        },
      });
    } catch (err) {
      return Either.makeLeft('Error on mail', HttpStatus.BAD_REQUEST);
    }
    return Either.makeRight('OK');
  }

  async forgottenPassword(email: string): Promise<Either<string>> {
    const user = await this.userModel.findOne({ email });
    if (!user) return Either.makeLeft('User undefined', HttpStatus.BAD_REQUEST);

    const payload: JWTPayloadI = { sub: user.id };

    const url = `${this.config.get(
      'server.frontUrl',
    )}/AUTh/recover-password?token=${this.jwtService.sign(payload, {
      expiresIn: '15m',
    })}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset',
      template: 'forgotten-password',
      context: {
        url,
        name: user.seller?.firstName || user.dealer?.name || user.email,
      },
    });
    return Either.makeRight('OK');
  }
}

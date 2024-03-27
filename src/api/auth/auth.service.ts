import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';
import { Either } from '@common/generics/either';
import { EmailCode } from '@database/schemas/email-code.schema';
import { User, UserDocument } from '@database/schemas/user.schema';

import { JWTPayloadI } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(EmailCode.name)
    private emailCodeModel: Model<EmailCode>,
    private config: ConfigService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne(
      { email },
      { password: 1, _id: 1, status: 1 },
    );
    if (user) {
      if (user.status === StatusEnum.notvalidated)
        throw new HttpException(
          { statusCode: 20001, message: 'Email do not exist' },
          HttpStatus.UNAUTHORIZED,
        );
      if (user.status === StatusEnum.unaproved)
        throw new HttpException(
          { statusCode: 20002, message: 'User not aproved' },
          HttpStatus.UNAUTHORIZED,
        );
      if (await bcrypt.compare(password, user.password)) return user;
    }
    throw new HttpException(
      { statusCode: 20001, message: 'Email do not exist' },
      HttpStatus.UNAUTHORIZED,
    );
  }

  async login(user: UserDocument) {
    const payload: JWTPayloadI = { sub: user.id };
    return Either.makeRight({
      access_token: this.jwtService.sign(payload),
    });
  }

  async emailValidation(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return Either.makeLeft(
        new HttpException('User undefined', HttpStatus.BAD_REQUEST),
      );

    const code = Math.floor(100000 + Math.random() * 600000).toString();

    let emailCode = await this.emailCodeModel.findOne({
      email,
    });
    if (!emailCode) {
      emailCode = new this.emailCodeModel({
        email,
        status: StatusEnum.active,
      });
    }
    emailCode.code = code;
    emailCode.save();

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Auto Sensei',
        template: 'welcome',
        context: {
          code,
          name: user.seller?.firstName || user.dealer?.firstName || user.email,
        },
      });
    } catch (err) {
      Logger.log(err);
      return Either.makeLeft(
        new HttpException('Error on mail', HttpStatus.BAD_REQUEST),
      );
    }
    return Either.makeRight('OK');
  }

  async validateEmailCode(email: string, code: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return Either.makeLeft(
        new HttpException('User undefined', HttpStatus.BAD_REQUEST),
      );

    const emailCode = await this.emailCodeModel.findOne({
      email,
      code,
    });
    if (!emailCode) {
      return Either.makeLeft(
        new HttpException('Code invalid', HttpStatus.BAD_REQUEST),
      );
    }

    const payload: JWTPayloadI = { sub: user.id };

    return Either.makeRight({
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
      }),
    });
  }

  async forgottenPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user)
      return Either.makeLeft(
        new HttpException('User undefined', HttpStatus.BAD_REQUEST),
      );

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
        name: user.seller?.firstName || user.dealer?.firstName || user.email,
      },
    });
    return Either.makeRight('OK');
  }
}

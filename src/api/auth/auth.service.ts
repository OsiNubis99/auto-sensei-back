import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { User, UserDocument } from '@database/schemas/user.schema';
import { JWTPayloadI } from './jwt.payload';

const regex =
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument> {
    let filter: FilterQuery<User>;
    if (regex.test(username)) filter = { email: username };
    else filter = { username };
    const user = await this.userModel.findOne(filter, { password: 1, _id: 1 });
    if (user && (await bcrypt.compare(password, user.password))) {
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

  async forgottenPassword(email: string): Promise<Either<string>> {
    const user = await this.userModel.findOne({ email });
    if (!user) return Either.makeLeft('User undefined', HttpStatus.BAD_REQUEST);
    const payload: JWTPayloadI = { sub: user.id };
    const access_token = this.jwtService.sign(payload);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset',
      template: 'welcome',
      context: {
        name: user.name,
        id: user.id,
        access_token: access_token,
      },
    });
    return Either.makeRight('OK');
  }
}

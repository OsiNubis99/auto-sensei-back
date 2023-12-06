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

interface P extends RegisterUserDto {}

interface R extends UserDocument {}

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class RegisterUserService implements IAppService<P, R> {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  async execute(param: P): Promise<Either<R>> {
    if (await this.userModel.findOne({ username: param.username }))
      return Either.makeLeft('Username already used', HttpStatus.BAD_REQUEST);

    if (await this.userModel.findOne({ email: param.email }))
      return Either.makeLeft('Email already used', HttpStatus.BAD_REQUEST);

    if (!regex.test(param.password))
      return Either.makeLeft('Pasword should be valid', HttpStatus.BAD_REQUEST);
    param.password = await bcrypt.hash(param.password, 10);

    const user = new this.userModel(param);
    const payload: JWTPayloadI = { sub: user.id };

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'welcome',
      context: {
        url: this.jwtService.sign(payload, { expiresIn: '15m' }),
        name: user.name,
      },
    });

    return Either.makeRight(await user.save());
  }
}

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

  async execute({ seller, dealer, ...param }: P): Promise<Either<R>> {
    const newUser: User = <User>{};

    if (seller && dealer)
      return Either.makeLeft('User only can be 1 type', HttpStatus.BAD_REQUEST);

    if (await this.userModel.findOne({ email: param.email }))
      return Either.makeLeft('Email already used', HttpStatus.BAD_REQUEST);
    newUser.email = param.email;

    if (!regex.test(param.password))
      return Either.makeLeft('Pasword should be valid', HttpStatus.BAD_REQUEST);
    newUser.password = await bcrypt.hash(param.password, 10);

    if (seller) {
      newUser.type = UserTypeEnum.seller;
      newUser.seller = seller;
    }

    if (dealer) {
      newUser.type = UserTypeEnum.dealer;
      newUser.dealer = dealer;
    }

    const user = new this.userModel(newUser);
    const payload: JWTPayloadI = { sub: user.id };

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'welcome',
      context: {
        url: this.jwtService.sign(payload, { expiresIn: '15m' }),
        name: user.seller?.firstName || user.dealer?.name || user.email,
      },
    });

    return Either.makeRight(await user.save());
  }
}

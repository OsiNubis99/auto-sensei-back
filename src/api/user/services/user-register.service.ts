import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { IAppService } from '@common/generics/IAppService';
import { User, UserDocument } from '@database/schemas/user.schema';

import { UserRegisterDto } from '../dto/user-register.dto';

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class UserRegisterService
  implements IAppService<UserRegisterDto, UserDocument>
{
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async execute(param: UserRegisterDto): Promise<Either<UserDocument>> {
    if (await this.userModel.findOne({ email: param.email }))
      return Either.makeLeft('Email already used');

    if (!regex.test(param.password))
      return Either.makeLeft('Pasword should be valid');
    param.password = await bcrypt.hash(param.password, 10);

    const user = new this.userModel(param);

    return Either.makeRight(await user.save());
  }
}

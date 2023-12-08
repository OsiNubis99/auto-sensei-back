import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { Either } from '@common/generics/Either';
import { IAppService } from '@common/generics/IAppService';
import { User, UserDocument } from '@database/schemas/user.schema';

import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';

interface P extends UpdateUserDto {
  user: UserDocument;
}

interface R extends UserDocument {}

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

@Injectable()
export class UpdateUserService implements IAppService<P, R> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async execute({
    user,
    password,
    seller,
    dealer,
    ...newData
  }: P): Promise<Either<R>> {
    if (
      newData.email &&
      newData.email !== user.email &&
      (await this.userModel.findOne({ email: newData.email }))
    )
      return Either.makeLeft('Email already used', HttpStatus.BAD_REQUEST);

    if (password) {
      if (!regex.test(password))
        return Either.makeLeft(
          'Pasword should be valid',
          HttpStatus.BAD_REQUEST,
        );
      user.password = await bcrypt.hash(password, 10);
    }

    if (user.type == UserTypeEnum.dealer && dealer) {
      for (const key of Object.keys(dealer)) {
        user.dealer[key] = dealer[key];
      }
    }

    if (user.type == UserTypeEnum.seller && seller) {
      for (const key of Object.keys(seller)) {
        user.seller[key] = seller[key];
      }
    }

    for (const key of Object.keys(newData)) {
      user[key] = newData[key];
    }

    user.status = true;

    return Either.makeRight(await user.save());
  }
}

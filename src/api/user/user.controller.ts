import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { UserRegisterDto } from './dto/user-register.dto';
import { UserRegisterService } from './services/user-register.service';
import { UserDocument } from '@database/schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private userRegisterService: UserRegisterService) {}

  @Post('register')
  async register(@Body() data: UserRegisterDto): Promise<UserDocument> {
    const response = await this.userRegisterService.execute(data);
    if (response.isLeft())
      throw new HttpException(response.getLeft(), HttpStatus.BAD_REQUEST);
    return response.getRight();
  }
}

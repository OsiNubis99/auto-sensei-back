import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { Either } from '@common/generics/Either';
import { UserDocument } from '@database/schemas/user.schema';

import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private registerUserService: RegisterUserService,
    private updateUserService: UpdateUserService,
  ) {}

  @Post('register')
  @BasicRequest<UserDocument>({
    description: 'Create a new user',
    response: 'User Document',
  })
  async register(@Body() data: RegisterUserDto): Promise<Either<UserDocument>> {
    return await this.registerUserService.execute(data);
  }

  @Put('')
  @AuthRequest<UserDocument>({
    description: 'Create a new user',
    response: 'User Document',
  })
  async update(
    @Request() { user }: { user: UserDocument },
    @Body() data: UpdateUserDto,
  ): Promise<Either<UserDocument>> {
    return await this.updateUserService.execute({ ...data, user });
  }
}

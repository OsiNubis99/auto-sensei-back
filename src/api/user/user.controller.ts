import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { Either } from '@common/generics/Either';
import { UserDocument } from '@database/schemas/user.schema';

import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private registerUserService: RegisterUserService,
    private updateUserService: UpdateUserService,
  ) {}

  @Get('/')
  @BasicRequest<UserDocument[]>({
    description: 'List all users (Admin Only)',
    response: 'User Document List',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('/sellers')
  @BasicRequest<UserDocument[]>({
    description: 'List Sellers Users',
    response: 'User Document List',
  })
  findSellers() {
    return this.userService.findSellers();
  }

  @Get('/dealers')
  @BasicRequest<UserDocument[]>({
    description: 'List Dealers Users',
    response: 'User Document List',
  })
  findDealers() {
    return this.userService.findDealers();
  }

  @Post('register')
  @BasicRequest<UserDocument>({
    description: 'Create a new user',
    response: 'User Document',
  })
  async register(@Body() data: RegisterUserDto): Promise<Either<UserDocument>> {
    return await this.registerUserService.execute(data);
  }

  @Put('/')
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

  @Delete('/:id')
  @BasicRequest<UserDocument>({
    description: 'Delete a user',
    response: 'User Document',
  })
  delete(@Param('id') _id: string) {
    return this.userService.delete({ _id });
  }
}

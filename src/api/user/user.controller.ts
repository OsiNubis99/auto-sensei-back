import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { IdDto } from '@common/dtos/id.dto';
import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
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

  @Get('/sellers')
  @AuthRequest<UserDocument[], HttpException>({
    description: 'List Sellers Users',
    response: 'User Document List',
  })
  findSellers(@Request() req: { user: UserDocument }) {
    return this.userService.findSellers(req.user);
  }

  @Get('/dealers')
  @AuthRequest<UserDocument[], HttpException>({
    description: 'List Dealers Users',
    response: 'User Document List',
  })
  findDealers(@Request() req: { user: UserDocument }) {
    return this.userService.findDealers(req.user);
  }

  @Get('seller/:id')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Get a user',
    response: 'User Document',
  })
  findSeller(@Param() param: IdDto) {
    return this.userService.findOne({ _id: param.id });
  }

  @Get('dealer/:id')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Get a user',
    response: 'User Document',
  })
  findDealer(@Param() param: IdDto) {
    return this.userService.findOne({ _id: param.id });
  }

  @Post('register')
  @BasicRequest<UserDocument, HttpException>({
    description: 'Create a new user',
    response: 'User Document',
  })
  async register(@Body() data: RegisterUserDto) {
    return this.registerUserService.execute(data);
  }

  @Put('/')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Create a new user',
    response: 'User Document',
  })
  async update(
    @Request() { user }: { user: UserDocument },
    @Body() data: UpdateUserDto,
  ) {
    return this.updateUserService.execute({ ...data, user });
  }

  @Get('/activate/:id')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  activateUser(@Param() param: IdDto) {
    return this.userService.setStatus({ _id: param.id }, StatusEnum.active);
  }

  @Get('/inactivate/:id')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  inactivateUser(@Param() param: IdDto) {
    return this.userService.setStatus({ _id: param.id }, StatusEnum.inactive);
  }

  @Delete('/:id')
  @AuthRequest<UserDocument, HttpException>({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  delete(@Param() param: IdDto) {
    return this.userService.delete({ _id: param.id });
  }
}

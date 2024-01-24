import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { UserD } from '@common/decorators/user.decorator';
import { IdDto } from '@common/dtos/id.dto';
import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { UserDocument } from '@database/schemas/user.schema';

import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserValorationsService } from './services/get-user-valorations.service';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private getValorationsService: GetUserValorationsService,
    private registerUserService: RegisterUserService,
    private updateUserService: UpdateUserService,
    private userService: UserService,
  ) {}

  @Get('/sellers')
  @AuthRequest({
    description: 'List Sellers Users',
    response: 'User Document List',
  })
  findSellers(@UserD() user: UserDocument) {
    return this.userService.findSellers(user);
  }

  @Get('/dealers')
  @AuthRequest({
    description: 'List Dealers Users',
    response: 'User Document List',
  })
  findDealers(@UserD() user: UserDocument) {
    return this.userService.findDealers(user);
  }

  @Get('/valorations')
  @AuthRequest({
    description: 'List User valorations',
    response: 'User valorations',
    roles: [UserTypeEnum.dealer],
  })
  getValorations(@UserD() user: UserDocument) {
    return this.getValorationsService.execute({ user });
  }

  @Get('/:id')
  @AuthRequest({
    description: 'Get a user',
    response: 'User Document',
  })
  findOne(@Param() param: IdDto) {
    return this.userService.findOne({ _id: param.id });
  }

  @Post('/')
  @BasicRequest({
    description: 'Create a new user',
    response: 'User Document',
  })
  register(@Body() data: RegisterUserDto) {
    return this.registerUserService.execute(data);
  }

  @Put('/')
  @AuthRequest({
    description: 'Update a user',
    response: 'User Document',
  })
  update(@UserD() user: UserDocument, @Body() data: UpdateUserDto) {
    return this.updateUserService.execute({ ...data, user });
  }

  @Patch('/activate/:id')
  @AuthRequest({
    description: 'Set user status to active',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  activateUser(@Param() param: IdDto) {
    return this.userService.setStatus({ _id: param.id }, StatusEnum.active);
  }

  @Patch('/inactivate/:id')
  @AuthRequest({
    description: 'Set user status to inactive',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  inactivateUser(@Param() param: IdDto) {
    return this.userService.setStatus({ _id: param.id }, StatusEnum.inactive);
  }

  @Delete('/:id')
  @AuthRequest({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  delete(@Param() param: IdDto) {
    return this.userService.delete({ _id: param.id });
  }
}

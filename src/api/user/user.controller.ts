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
import { PhoneDto } from '@common/dtos/phone.dto';
import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { UserDocument } from '@database/schemas/user.schema';

import { AddPaymentMethodDto } from './dto/add-payment-method.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddPaymentMethodService } from './services/add-payment-method.service';
import { GetUserStatsService } from './services/get-user-stats.service';
import { GetUserValorationsService } from './services/get-user-valorations.service';
import { RegisterUserService } from './services/register-user.service';
import { SendValidationCodeService } from './services/send-validation-code.service';
import { UpdateUserService } from './services/update-user.service';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private addPaymentMethodService: AddPaymentMethodService,
    private getStatsService: GetUserStatsService,
    private getValorationsService: GetUserValorationsService,
    private registerUserService: RegisterUserService,
    private sendValidationCodeService: SendValidationCodeService,
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

  @Get('/stats')
  @AuthRequest({
    description: 'List User valorations',
    response: 'User valorations',
    roles: [UserTypeEnum.dealer],
  })
  getStats(@UserD() user: UserDocument) {
    return this.getStatsService.execute({ user });
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

  @Get('/:_id')
  @AuthRequest({
    description: 'Get a user',
    response: 'User Document',
  })
  findOne(@Param() { _id }: IdDto) {
    return this.userService.findOne({ _id });
  }

  @Post('/')
  @BasicRequest({
    description: 'Create a new user',
    response: 'User Document',
  })
  register(@Body() data: RegisterUserDto) {
    return this.registerUserService.execute(data);
  }

  @Post('/send-validation-code')
  @BasicRequest({
    description: 'Create a new user',
    response: 'User Document',
  })
  sendValidationCode(@Body() data: PhoneDto) {
    return this.sendValidationCodeService.execute(data);
  }

  @Post('/payment_method')
  @AuthRequest({
    description: 'Create a new user',
    response: 'User Document',
  })
  addPaymentMethod(
    @UserD() user: UserDocument,
    @Body() data: AddPaymentMethodDto,
  ) {
    return this.addPaymentMethodService.execute({ user, ...data });
  }

  @Put('/')
  @AuthRequest({
    description: 'Update a user',
    response: 'User Document',
  })
  update(@UserD() user: UserDocument, @Body() data: UpdateUserDto) {
    return this.updateUserService.execute({ ...data, user });
  }

  @Patch('/activate/:_id')
  @AuthRequest({
    description: 'Set user status to active',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  activateUser(@Param() { _id }: IdDto) {
    return this.userService.setStatus({ _id }, StatusEnum.active);
  }

  @Patch('/inactivate/:_id')
  @AuthRequest({
    description: 'Set user status to inactive',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  inactivateUser(@Param() { _id }: IdDto) {
    return this.userService.setStatus({ _id }, StatusEnum.inactive);
  }

  @Delete('/:_id')
  @AuthRequest({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  delete(@Param() { _id }: IdDto) {
    return this.userService.delete({ _id });
  }
}

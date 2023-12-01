import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { Either } from '@common/generics/Either';
import { UserDocument } from '@database/schemas/user.schema';

import { LoginDto } from '@auth/dto/login.dto';
import { AuthService } from './auth.service';
import { ForgottenPasswordDto } from './dto/forgotten-password.dto';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @BasicRequest({
    description: 'Validate email and password',
    response: 'Bearer access_token',
  })
  @ApiBody({ type: LoginDto })
  async login(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @AuthRequest({
    description: 'Validate bearer token',
    response: 'User model',
  })
  getProfile(@Request() req: { user: UserDocument }) {
    return Either.makeRight(req.user);
  }

  @Post('forgotten-password/')
  @BasicRequest({
    description: 'Send forgottenPassword email if user exist',
    response: 'OK',
  })
  async forgottenPassword(@Body() data: ForgottenPasswordDto) {
    return this.authService.forgottenPassword(data.email);
  }
}

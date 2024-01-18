import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { Either } from '@common/generics/either';
import { UserDocument } from '@database/schemas/user.schema';

import { LoginDto } from '@auth/dto/login.dto';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';
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
  @AuthRequest<UserDocument, HttpException>({
    description: 'Validate bearer token',
    response: 'User model',
  })
  getProfile(@Request() req: { user: UserDocument }) {
    return Either.makeRight(req.user);
  }

  @Post('send-email-validation')
  @BasicRequest<string, HttpException>({
    description: 'Send EmailValidation email if user exist',
    response: 'OK',
  })
  async emailValidation(@Body() data: EmailDto) {
    return this.authService.emailValidation(data.email);
  }

  @Post('forgotten-password')
  @BasicRequest<string, HttpException>({
    description: 'Send forgottenPassword email if user exist',
    response: 'OK',
  })
  async forgottenPassword(@Body() data: EmailDto) {
    return this.authService.forgottenPassword(data.email);
  }
}

import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Document } from 'mongoose';

import { User, UserDocument } from '@database/schemas/user.schema';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: UserDocument }) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Request() req: { user: Document<User> }) {
    return req.user;
  }
}

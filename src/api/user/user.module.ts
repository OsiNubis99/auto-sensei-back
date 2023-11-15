import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { UserRegisterService } from './services/user-register.service';
import { UserController } from './user.controller';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserRegisterService],
})
export class UserModule {}

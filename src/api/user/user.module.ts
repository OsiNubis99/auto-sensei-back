import { CommonModule } from '@common/common.module';
import { Module } from '@nestjs/common';
import { RegisterUserService } from './services/register-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [RegisterUserService, UpdateUserService],
})
export class UserModule {}

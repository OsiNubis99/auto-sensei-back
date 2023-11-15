import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserLoginDto } from './user-login.dto';

export class UserRegisterDto extends UserLoginDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

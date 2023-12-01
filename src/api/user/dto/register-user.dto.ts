import { LoginDto } from '@auth/dto/login.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto extends LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'user type',
    example: UserTypeEnum.dealer,
    enum: UserTypeEnum,
  })
  type: UserTypeEnum;

  @IsNotEmpty()
  @ApiProperty({
    description: "user's name",
    example: 'Barry',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: "user's email",
    example: 'barryallen@justiceleague.com',
  })
  email: string;
}

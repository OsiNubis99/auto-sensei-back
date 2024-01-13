import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "user's email",
    example: 'barryallen@justiceleague.com',
  })
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description: "user's password",
    example: 'theFastestManAlive1*',
  })
  password: string;
}

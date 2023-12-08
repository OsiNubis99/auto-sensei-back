import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    description: "user's email",
    example: 'barryallen@justiceleague.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: "user's password",
    example: 'theFastestManAlive1*',
  })
  password: string;
}

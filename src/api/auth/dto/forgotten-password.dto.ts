import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgottenPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'user email',
    example: 'barryallen@justiceleague.com',
    required: true,
  })
  email: string;
}

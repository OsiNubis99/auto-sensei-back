import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneDto {
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Phone number with international calling code',
    example: '+15557720901',
  })
  phone: string;
}

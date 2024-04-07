import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { IsNumberString, IsOptional, Length } from 'class-validator';

import { PhoneDto } from '@common/dtos/phone.dto';

import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto extends IntersectionType(
  PartialType(RegisterUserDto),
  PartialType(PhoneDto),
) {
  @IsNumberString()
  @Length(6, 6)
  @IsOptional()
  @ApiProperty({
    description: 'Phone validation code',
    example: '720901',
  })
  validationCode: string;
}

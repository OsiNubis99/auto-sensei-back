import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

import { UserTypeEnum } from '@common/enums/user-type.enum';
import { User } from '@database/schemas/user.schema';

export class UpdateUserDto implements User {
  @IsOptional()
  type: UserTypeEnum;

  @IsOptional()
  @ApiProperty({
    description: 'user name',
    example: 'Barry',
    required: false,
  })
  name: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'user email',
    example: 'barryallen@justiceleague.com',
    required: false,
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    description: 'user username',
    example: 'barryallen1',
    required: false,
  })
  username: string;

  @IsOptional()
  @ApiProperty({
    description: 'user password',
    example: 'theFastestManAlive1*',
    required: false,
  })
  password: string;
}

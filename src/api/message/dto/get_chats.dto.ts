import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetChatsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'User Id',
    required: true,
  })
  userId: string;
}

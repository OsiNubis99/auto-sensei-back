import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Chat Id',
    required: true,
  })
  chatId: string;
}

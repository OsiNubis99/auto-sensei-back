import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Chat Id',
    required: true,
  })
  chatId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: true,
    required: true,
  })
  message: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: true,
    required: true,
  })
  url?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UrlDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'url',
    required: true,
  })
  url: string;
}

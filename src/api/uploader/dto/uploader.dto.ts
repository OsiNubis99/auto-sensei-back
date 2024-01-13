import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploaderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'donde pertenece la imagen',
    example: 'carpeta/subcarpeta',
  })
  location: string;
}

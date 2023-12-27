import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploaderDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'donde pertenece la imagen',
    example: 'carpeta/subcarpeta',
    required: true,
  })
  location: string;
}

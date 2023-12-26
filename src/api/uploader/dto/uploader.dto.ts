import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploaderDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'nombre que se le dara al archivo',
    example: '01001JohnDoe',
    required: true,
  })
  name: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'donde pertenece la imagen',
    example: 'sponsor',
    required: true,
  })
  location: string;
}

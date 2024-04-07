import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContactDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contact Email',
    example: 'test@test.ca',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contact Phone',
    example: '12345689100',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contact Name',
    example: 'Name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Contact Description',
    example: 'Hi there',
  })
  description: string;
}

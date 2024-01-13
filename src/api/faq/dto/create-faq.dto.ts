import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'FAQ Question',
    example: 'Is auto sensei very cool?',
  })
  question: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'FAQ Answer',
    example: 'Yes!!',
  })
  answer: string;
}

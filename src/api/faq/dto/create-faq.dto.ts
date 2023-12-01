import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFaqDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'FAQ Question',
    example: 'Is auto sensei very cool?',
  })
  readonly question: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'FAQ Answer',
    example: 'Yes!!',
  })
  readonly answer: string;
}

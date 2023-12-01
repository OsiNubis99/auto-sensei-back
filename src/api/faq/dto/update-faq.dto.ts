import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFaqDto {
  @IsOptional()
  @ApiProperty({
    description: 'FAQ Question',
    example: 'Is auto sensei very cool?',
  })
  readonly question: string;

  @IsOptional()
  @ApiProperty({
    description: 'FAQ Answer',
    example: 'Yes!!',
  })
  readonly answer: string;
}

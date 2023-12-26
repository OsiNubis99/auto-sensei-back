import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadChallengeDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  file: Express.Multer.File;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del challenge',
    example: '349',
    required: true,
  })
  idChallenge: number;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del usuario',
    example: '15432',
    required: true,
  })
  idUser: number;
}

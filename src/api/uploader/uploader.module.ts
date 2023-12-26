import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';

@Module({
  imports: [CommonModule],
  exports: [UploaderService],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}

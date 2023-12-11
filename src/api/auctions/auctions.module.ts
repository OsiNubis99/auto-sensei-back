import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { CreateAuctionService } from './services/create-auctions.service';

@Module({
  imports: [CommonModule],
  controllers: [AuctionsController],
  providers: [AuctionsService, CreateAuctionService],
})
export class AuctionsModule {}

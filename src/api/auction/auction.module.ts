import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { CreateAuctionService } from './services/create-auction.service';
import { CreateBidService } from './services/create-bid.service';
import { UpdateAuctionService } from './services/update-auction.service';

@Module({
  imports: [CommonModule],
  controllers: [AuctionController],
  providers: [
    AuctionService,
    CreateAuctionService,
    CreateBidService,
    UpdateAuctionService,
  ],
})
export class AuctionsModule {}
import { Module } from '@nestjs/common';

import { CommonModule } from '@common/common.module';

import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { AcceptAuctionService } from './services/accept-auction.service';
import { AddAuctionRemindService } from './services/add-auction-remind.service';
import { CreateAuctionService } from './services/create-auction.service';
import { CreateBidService } from './services/create-bid.service';
import { CreateContractService } from './services/create-contract.service';
import { DropOffAuctionService } from './services/drop-off-auction.service';
import { GetAuctionService } from './services/get-auction.service';
import { GetCurrentBidsAuctionsService } from './services/get-current-bids-auctions.service';
import { RemoveAuctionRemindService } from './services/remove-auction-remind.service';
import { UpdateAuctionService } from './services/update-auction.service';
import { UpdateBidService } from './services/update-bid.service';
import { ValorateAuctionService } from './services/valorate-auction.service';
import { AuctionNotificationService } from './services/auction-notification.service';
import { LaunchAuctionService } from './services/launch-auction.service';

@Module({
  imports: [CommonModule],
  controllers: [AuctionController],
  providers: [
    AcceptAuctionService,
    AddAuctionRemindService,
    AuctionService,
    CreateAuctionService,
    CreateBidService,
    CreateContractService,
    DropOffAuctionService,
    GetAuctionService,
    GetCurrentBidsAuctionsService,
    UpdateAuctionService,
    UpdateBidService,
    RemoveAuctionRemindService,
    ValorateAuctionService,
    AuctionNotificationService,
    LaunchAuctionService,
  ],
})
export class AuctionsModule {}

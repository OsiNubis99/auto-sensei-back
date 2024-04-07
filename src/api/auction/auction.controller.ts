import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { BasicRequest } from '@common/decorators/basic-request';
import { IdDto } from '@common/dtos/id.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { UserDocument } from '@database/schemas/user.schema';

import { UserD } from '@common/decorators/user.decorator';
import PDFService from '@common/services/pdf.service';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { FilterAuctionDto } from './dto/filter-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { ValorateAuctionDto } from './dto/valorate-auction.dto';
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

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(
    private readonly acceptAuctionService: AcceptAuctionService,
    private readonly dropOffAuctionService: DropOffAuctionService,
    private readonly addAuctionRemindService: AddAuctionRemindService,
    private readonly auctionService: AuctionService,
    private readonly createAuctionService: CreateAuctionService,
    private readonly createBidService: CreateBidService,
    private readonly createContractService: CreateContractService,
    private readonly updateBidService: UpdateBidService,
    private readonly getAuctionService: GetAuctionService,
    private readonly getCurrentBidsAuctionsService: GetCurrentBidsAuctionsService,
    private readonly updateAuctionService: UpdateAuctionService,
    private readonly removeAuctionRemindService: RemoveAuctionRemindService,
    private readonly valorateAuctionService: ValorateAuctionService,
    private pdfService: PDFService,
  ) {}

  @Get('/:_id')
  @BasicRequest({
    description: 'List auction by ID',
    response: 'Auction Document',
  })
  findOne(@Param() { _id }: IdDto) {
    return this.auctionService.findOne({ _id });
  }

  @Get('contract/:_id')
  @AuthRequest({
    description: 'List auction by ID',
    response: 'Auction Document',
  })
  getContract(@UserD() user: UserDocument, @Param() { _id }: IdDto) {
    return this.createContractService.execute({ user, _id });
  }

  @Post('/')
  @AuthRequest({
    description: 'Create a new auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  create(@UserD() user: UserDocument, @Body() body: CreateAuctionDto) {
    return this.createAuctionService.execute({ user, ...body });
  }

  @Post('/find-all')
  @AuthRequest({
    description: 'List auctions',
    response: 'Auction Document',
  })
  findAll(@UserD() user: UserDocument, @Body() data: FilterAuctionDto) {
    return this.getAuctionService.execute({ user, ...data });
  }

  @Post('/find/current-bids')
  @AuthRequest({
    description: 'List auctions',
    response: 'Auction Document',
  })
  findCurrentBids(@UserD() user: UserDocument, @Body() data: FilterAuctionDto) {
    return this.getCurrentBidsAuctionsService.execute({ user, ...data });
  }

  @Post('/bid/:_id')
  @AuthRequest({
    description: 'Create a new bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  createBid(
    @Param() { _id }: IdDto,
    @Body() data: CreateBidDto,
    @UserD() user: UserDocument,
  ) {
    return this.createBidService.execute({ _id, user, ...data });
  }

  @Post('/valorate/:_id')
  @AuthRequest({
    description: 'Create a valoration',
    response: 'Auction Document',
  })
  valorate(
    @Param() { _id }: IdDto,
    @Body() data: ValorateAuctionDto,
    @UserD() user: UserDocument,
  ) {
    return this.valorateAuctionService.execute({
      _id,
      user,
      ...data,
    });
  }

  @Put('/:_id')
  @AuthRequest({
    description: 'Update an auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller, UserTypeEnum.admin],
  })
  update(
    @Param() { _id }: IdDto,
    @Body() data: UpdateAuctionDto,
    @UserD() user: UserDocument,
  ) {
    return this.updateAuctionService.execute({ _id, user, ...data });
  }

  @Patch('/:_id/add-remind')
  @AuthRequest({
    description: 'Add dealer to Auction remind list',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  addRemind(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.addAuctionRemindService.execute({ _id, user });
  }

  @Patch('/:_id/remove-remind')
  @AuthRequest({
    description: 'Remove dealer from Auction remind list',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  removeRemind(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.removeAuctionRemindService.execute({ _id, user });
  }

  @Patch('/bid/:_id')
  @AuthRequest({
    description: 'Create a new bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  updateBid(
    @Param() { _id }: IdDto,
    @Body() data: UpdateBidDto,
    @UserD() user: UserDocument,
  ) {
    return this.updateBidService.execute({ _id, user, ...data });
  }

  @Patch('/aprove/:_id')
  @AuthRequest({
    description: 'Aprove an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  aprove(@Param() { _id }: IdDto) {
    return this.auctionService.aprove({ _id });
  }

  @Patch('/reject/:_id')
  @AuthRequest({
    description: 'Reject an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  reject(@Param() { _id }: IdDto) {
    return this.auctionService.reject({ _id });
  }

  @Patch('/accept/:_id')
  @AuthRequest({
    description: 'Accept last Auction Bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  accept(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.acceptAuctionService.execute({
      user,
      filter: { _id },
    });
  }

  @Patch('/decline/:_id')
  @AuthRequest({
    description: 'Inactivate last Auction bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  decline(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.decline(user, { _id });
  }

  @Patch('/drop-off/:_id')
  @AuthRequest({
    description: 'Set drop off an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  dropOff(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.dropOffAuctionService.execute({ user, filter: { _id } });
  }

  @Patch('/cancel/:_id')
  @AuthRequest({
    description: 'Cancel an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  cancel(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.cancel(user, { _id });
  }

  @Delete('/:_id')
  @AuthRequest({
    description: 'Delete an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  remove(@Param() { _id }: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.remove(user, { _id });
  }
}

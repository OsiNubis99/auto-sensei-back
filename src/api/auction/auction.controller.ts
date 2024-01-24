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

import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { FilterAuctionDto } from './dto/filter-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateAuctionService } from './services/create-auction.service';
import { CreateBidService } from './services/create-bid.service';
import { GetAuctionService } from './services/get-auction.service';
import { UpdateAuctionService } from './services/update-auction.service';
import { ValorateAuctionService } from './services/valorate-auction.service';
import { ValorateAuctionDto } from './dto/valorate-auction.dto';
import { UserD } from '@common/decorators/user.decorator';

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(
    private readonly auctionService: AuctionService,
    private readonly createAuctionService: CreateAuctionService,
    private readonly createBidService: CreateBidService,
    private readonly getAuctionService: GetAuctionService,
    private readonly updateAuctionService: UpdateAuctionService,
    private readonly valorateAuctionService: ValorateAuctionService,
  ) {}

  @Get('/:id')
  @BasicRequest({
    description: 'List auction by ID',
    response: 'Auction Document',
  })
  findOne(@Param() param: IdDto) {
    return this.auctionService.findOne({ _id: param.id });
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

  @Post('/bid/:id')
  @AuthRequest({
    description: 'Create a new bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  createBid(
    @Param() param: IdDto,
    @Body() data: CreateBidDto,
    @UserD() user: UserDocument,
  ) {
    return this.createBidService.execute({ _id: param.id, user, ...data });
  }

  @Post('/valorate/:id')
  @AuthRequest({
    description: 'Create a valoration',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  valorate(
    @Param() param: IdDto,
    @Body() data: ValorateAuctionDto,
    @UserD() user: UserDocument,
  ) {
    return this.valorateAuctionService.execute({
      _id: param.id,
      user,
      ...data,
    });
  }

  @Put('/:id')
  @AuthRequest({
    description: 'Update an auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller, UserTypeEnum.admin],
  })
  update(
    @Param() param: IdDto,
    @Body() data: UpdateAuctionDto,
    @UserD() user: UserDocument,
  ) {
    return this.updateAuctionService.execute({ _id: param.id, user, ...data });
  }

  @Patch('/aprove/:id')
  @AuthRequest({
    description: 'Aprove an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  aprove(@Param() param: IdDto) {
    return this.auctionService.aprove({ _id: param.id });
  }

  @Patch('/reject/:id')
  @AuthRequest({
    description: 'Reject an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  reject(@Param() param: IdDto) {
    return this.auctionService.reject({ _id: param.id });
  }

  @Patch('/accept/:id')
  @AuthRequest({
    description: 'Accept last Auction Bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  accept(@Param() param: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.accept(user, { _id: param.id });
  }

  @Patch('/decline/:id')
  @AuthRequest({
    description: 'Inactivate last Auction bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  decline(@Param() param: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.decline(user, { _id: param.id });
  }

  @Patch('/cancel/:id')
  @AuthRequest({
    description: 'Cancel an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  cancel(@Param() param: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.cancel(user, { _id: param.id });
  }

  @Delete('/:id')
  @AuthRequest({
    description: 'Delete an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  remove(@Param() param: IdDto, @UserD() user: UserDocument) {
    return this.auctionService.remove(user, { _id: param.id });
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { IdDto } from '@common/dtos/id.dto';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { CreateBidDto } from './dto/create-bid.dto';
import { FilterAuctionDto } from './dto/filter-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateAuctionService } from './services/create-auction.service';
import { CreateBidService } from './services/create-bid.service';
import { UpdateAuctionService } from './services/update-auction.service';
import { BasicRequest } from '@common/decorators/basic-request';

@ApiTags('Auction')
@Controller('auction')
export class AuctionController {
  constructor(
    private readonly auctionService: AuctionService,
    private readonly createAuctionService: CreateAuctionService,
    private readonly createBidService: CreateBidService,
    private readonly updateAuctionService: UpdateAuctionService,
  ) {}

  @Post('/')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Create a new user',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  create(
    @Request() { user }: { user: UserDocument },
    @Body() body: CreateAuctionDto,
  ) {
    return this.createAuctionService.execute({ user, ...body });
  }

  @Post('/find-all')
  @AuthRequest<AuctionDocument[], HttpException>({
    description: 'Create a new user',
    response: 'Auction Document',
  })
  findAll(
    @Request() { user }: { user: UserDocument },
    @Body() data: FilterAuctionDto,
  ) {
    return this.auctionService.findAll(user, data);
  }

  @Get('/:id')
  @BasicRequest({
    description: '',
    response: '',
  })
  findOne(@Param() param: IdDto) {
    return this.auctionService.findOne({ _id: param.id });
  }

  @Put('/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Create a new user',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller, UserTypeEnum.admin],
  })
  update(
    @Param() param: IdDto,
    @Body() data: UpdateAuctionDto,
    @Request() { user }: { user: UserDocument },
  ) {
    return this.updateAuctionService.execute({ _id: param.id, user, ...data });
  }

  @Put('/aprove/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Activate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  aprove(@Param() param: IdDto) {
    return this.auctionService.aprove({ _id: param.id });
  }

  @Put('/reject/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Inactivate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  reject(@Param() param: IdDto) {
    return this.auctionService.reject({ _id: param.id });
  }

  @Put('/cancel/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Inactivate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  cancel(@Param() param: IdDto, @Request() { user }: { user: UserDocument }) {
    return this.auctionService.cancel(user, { _id: param.id });
  }

  @Delete('/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Inactivate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.seller],
  })
  remove(@Param() param: IdDto, @Request() { user }: { user: UserDocument }) {
    return this.auctionService.remove(user, { _id: param.id });
  }

  @Post('/bid/:id')
  @AuthRequest<AuctionDocument[], HttpException>({
    description: 'Create a new bid',
    response: 'Auction Document',
    roles: [UserTypeEnum.dealer],
  })
  createBid(
    @Param() param: IdDto,
    @Body() data: CreateBidDto,
    @Request() { user }: { user: UserDocument },
  ) {
    return this.createBidService.execute({ _id: param.id, user, ...data });
  }
}

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
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
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

  @Put('/activate/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Activate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  activate(@Param() param: IdDto) {
    return this.auctionService.setStatus(
      { _id: param.id },
      AuctionStatusEnum.upcoming,
    );
  }

  @Put('/inactivate/:id')
  @AuthRequest<AuctionDocument, HttpException>({
    description: 'Inactivate an Auction',
    response: 'Auction Document',
    roles: [UserTypeEnum.admin],
  })
  inactivate(@Param() param: IdDto) {
    return this.auctionService.setStatus(
      { _id: param.id },
      AuctionStatusEnum.canceled,
    );
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.auctionService.remove(+id);
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

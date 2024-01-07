import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthRequest } from '@common/decorators/auth-request';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Either } from '@common/generics/Either';
import { AuctionDocument } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { CreateAuctionService } from './services/create-auctions.service';
import { UpdateAuctionService } from './services/update-auctions.service';
import { AuctionStatusEnum } from '@common/enums/auction-status.enum';
import { FilterAuctionDto } from './dto/filter-auction.dto';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(
    private readonly auctionsService: AuctionsService,
    private readonly createAuctionService: CreateAuctionService,
    private readonly updateAuctionService: UpdateAuctionService,
  ) {}

  @Post()
  @AuthRequest<AuctionDocument>({
    description: 'Create a new user',
    response: 'User Document',
    roles: [UserTypeEnum.seller],
  })
  create(
    @Request() { user }: { user: UserDocument },
    @Body() body: CreateAuctionDto,
  ): Promise<Either<AuctionDocument>> {
    return this.createAuctionService.execute({ user, ...body });
  }

  @Post('/findAll')
  @AuthRequest<AuctionDocument[]>({
    description: 'Create a new user',
    response: 'User Document',
  })
  findAll(
    @Request() { user }: { user: UserDocument },
    @Body() data: FilterAuctionDto,
  ) {
    return this.auctionsService.findAll(user, data);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.auctionsService.findOne({ _id });
  }

  @Put(':id')
  @AuthRequest<AuctionDocument>({
    description: 'Create a new user',
    response: 'User Document',
    roles: [UserTypeEnum.seller, UserTypeEnum.admin],
  })
  update(
    @Param('id') _id: string,
    @Body() data: UpdateAuctionDto,
    @Request() { user }: { user: UserDocument },
  ): Promise<Either<AuctionDocument>> {
    return this.updateAuctionService.execute({ _id, user, ...data });
  }

  @Put('/activate/:id')
  @AuthRequest<UserDocument>({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  activate(@Param('id') _id: string) {
    return this.auctionsService.setStatus({ _id }, AuctionStatusEnum.upcoming);
  }

  @Put('/inactivate/:id')
  @AuthRequest<UserDocument>({
    description: 'Delete a user',
    response: 'User Document',
    roles: [UserTypeEnum.admin],
  })
  inactivate(@Param('id') _id: string) {
    return this.auctionsService.setStatus({ _id }, AuctionStatusEnum.canceled);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.auctionsService.remove(+id);
  }
}

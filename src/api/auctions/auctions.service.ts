import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { StatusEnum } from '@common/enums/status.enum';
import { UserTypeEnum } from '@common/enums/user-type.enum';
import { Auction } from '@database/schemas/auction.schema';
import { UserDocument } from '@database/schemas/user.schema';

import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Either } from '@common/generics/Either';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectModel(Auction.name)
    private auctionModel: Model<Auction>,
  ) {}

  async findAll(user: UserDocument) {
    let filter = <FilterQuery<Auction>>{};
    if (user.type == UserTypeEnum.seller)
      filter = {
        owner: user._id,
      };
    if (user.type == UserTypeEnum.dealer)
      filter = { status: StatusEnum.active };
    return Either.makeRight(await this.auctionModel.find(filter));
  }

  async findOne(filter: FilterQuery<Auction>) {
    return Either.makeRight(await this.auctionModel.find(filter));
  }

  update(id: number, data: UpdateAuctionDto) {
    return Either.makeRight(`This action updates a #${id} auction` + data.city);
  }

  remove(id: number) {
    return Either.makeRight(`This action removes a #${id} auction`);
  }
}

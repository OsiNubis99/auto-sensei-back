import { AuctionDocument } from '@database/schemas/auction.schema';

export interface DealerStatsI {
  total_auciton: number;
  total_won: number;
  success_rate: string;
  total_purchase: number;
  top: AuctionDocument[];
}

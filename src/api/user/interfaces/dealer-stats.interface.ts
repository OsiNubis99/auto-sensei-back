import { AuctionDocument } from '@database/schemas/auction.schema';

export interface DealerStatsI {
  total_auciton: number;
  success_rate: string;
  total_won: number;
  total_purchase: number;
  top: AuctionDocument[];
}

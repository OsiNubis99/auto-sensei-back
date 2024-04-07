export enum AuctionStatusEnum {
  'DELETED' = 'deleted', //0
  'DRAFT' = 'draft', //1
  'UNAPPROVED' = 'unapproved', //2
  'UPCOMING' = 'upcoming', //3.1
  'LIVE' = 'live', //4.1
  'BIDS_COMPLETED' = 'bids completed', //5
  // Sing and pay tax
  'COMPLETED' = 'completed', //6.1
  // Sing and pay full amount
  'DROP_OFF' = 'drop off', //7
  'REVIEWED' = 'reviewed', //8

  'REJECTED' = 'rejected', //3.2
  'CANCELLED' = 'cancelled', //4.2
  'DECLINED' = 'declined', //6.2
}

export class MakePaymentDto {
  amount: number;
  customer: string;
  payment_method: string;
  receipt_email: string;
}

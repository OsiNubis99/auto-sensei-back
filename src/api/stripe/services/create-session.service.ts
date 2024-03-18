import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AppServiceI } from '@common/generics/app-service.interface';
import { Either } from '@common/generics/either';
import StripeService from '@common/services/stripe.service';
import { UserDocument } from '@database/schemas/user.schema';

type P = {
  user: UserDocument;
};

type R = { url: string };

@Injectable()
export class CreateSessionService implements AppServiceI<P, R, HttpException> {
  constructor(private stripeService: StripeService) {}

  async execute({ user }: P) {
    if (!user.customerId) {
      const name = user.dealer?.name || user.seller?.firstName || '';
      const customerResponse = await this.stripeService.createCustomer(
        name,
        user.email,
      );
      if (customerResponse.isLeft())
        return Either.makeLeft(
          new HttpException(customerResponse.getLeft(), HttpStatus.BAD_REQUEST),
        );
      user.customerId = customerResponse.getRight().id;
      user.save();
    }
    return await this.stripeService.createSession(user.id, user.customerId);
  }
}

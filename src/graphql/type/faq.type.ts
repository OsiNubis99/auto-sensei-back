import { ObjectType, Field, ID } from '@nestjs/graphql';

import { Faq } from '@database/schemas/faq.schema';

@ObjectType()
export class FaqType implements Faq {
  @Field(() => ID, { description: 'FAQ ID' })
  readonly _id: string;

  @Field({
    description: 'FAQ Question',
  })
  readonly question: string;

  @Field({
    description: 'FAQ Answer',
  })
  readonly answer: string;
}

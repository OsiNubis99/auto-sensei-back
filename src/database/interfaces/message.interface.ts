import { UserDocument } from '@database/schemas/user.schema';

export class MessageI {
  message: string;
  user: UserDocument;
  readAt?: Date;
}

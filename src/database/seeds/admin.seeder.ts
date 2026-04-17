import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { StatusEnum } from '../../common/enums/status.enum';
import { UserTypeEnum } from '../../common/enums/user-type.enum';
import { User } from '../schemas/user.schema';

@Injectable()
export class AdminSeeder {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async run() {
    const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@autosensei.ca';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('SEED_ADMIN_PASSWORD env var is required');
    }

    const existing = await this.userModel.findOne({ email: adminEmail }).exec();
    if (existing) {
      this.logger.log(`Admin user ${adminEmail} already exists — skipping`);
      return;
    }

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await this.userModel.create({
      email: adminEmail,
      password: passwordHash,
      type: UserTypeEnum.admin,
      status: StatusEnum.active,
    });

    this.logger.log(`Admin user ${adminEmail} created`);
  }
}

import { NestFactory } from '@nestjs/core';

import { AdminSeeder } from './admin.seeder';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  try {
    const admin = app.get(AdminSeeder);
    await admin.run();
    // eslint-disable-next-line no-console
    console.log('✅ Seeding complete');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Seeding failed:', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();

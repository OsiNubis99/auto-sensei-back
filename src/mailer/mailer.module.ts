import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const port = Number(configService.get<string>('mailer.port'));
        return {
          transport: {
            host: configService.get<string>('mailer.host'),
            port,
            // 465 → SSL directo; 587 → STARTTLS (upgrade en caliente).
            secure: port === 465,
            auth: {
              user: configService.get<string>('mailer.user'),
              pass: configService.get<string>('mailer.pass'),
            },
          },
          defaults: {
            from:
              configService.get<string>('mailer.from') ||
              `"AutoSensei" <${configService.get<string>('mailer.user')}>`,
          },
          template: {
            dir: 'src/mailer/templates/',
            adapter: new EjsAdapter({ inlineCssEnabled: true }),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
})
export class MailerModule {}

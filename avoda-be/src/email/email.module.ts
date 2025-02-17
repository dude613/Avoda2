import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { ResendService } from './resend.service';
import { NodeMailerService } from './nodemailer.service';
import { EmailService } from './email.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'avoda-redis-email-queue',
    }),
  ],
  providers: [ResendService, NodeMailerService, EmailService],
  exports: [ResendService, NodeMailerService, EmailService],
})
export class EmailModule {}

import { Module } from '@nestjs/common';

import { ResendService } from './resend.service';
import { EmailService } from './nodemailer.service';

@Module({
  providers: [ResendService, EmailService],
  exports: [ResendService, EmailService],
})
export class EmailModule {}

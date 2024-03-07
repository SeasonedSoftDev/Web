import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { SendgridService } from './sendgrid.service';

@Module({
  providers: [MailService, SendgridService],
  exports: [MailService],
})
export class MailModule {}

import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MailModule } from '../../integrations/mail/mail.module';
import { ClientReminderService } from './jobs/client-reminder.job';

@Module({
  imports: [MailModule],
  controllers: [ClientController],
  providers: [ClientService, ClientReminderService],
  exports: [ClientService],
})
export class ClientModule {
  constructor(private readonly ClientReminderService: ClientReminderService) {}

  async onModuleInit() {
    // TODO This is running first on every build, so it might be better to leave it commented out
    // await this.ClientReminderService.remindAdminsAboutUnconfirmedClientsJob();
  }
}

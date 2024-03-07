import { Module } from '@nestjs/common';
import { AmbassadorService } from './ambassador.service';
import { AmbassadorController } from './ambassador.controller';
import { MailModule } from '../../integrations/mail/mail.module';

@Module({
  imports: [MailModule],
  providers: [AmbassadorService],
  controllers: [AmbassadorController],
})
export class AmbassadorModule {}

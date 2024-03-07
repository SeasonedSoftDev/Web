import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { MailModule } from 'src/integrations/mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [SurveysController],
  providers: [SurveysService],
})
export class SurveysModule {}

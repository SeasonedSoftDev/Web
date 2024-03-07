import { Module } from '@nestjs/common';
import { InstagramService } from './instagram/instagram.service';

@Module({
  providers: [InstagramService],
  exports: [InstagramService],
})
export class SocialModule {}

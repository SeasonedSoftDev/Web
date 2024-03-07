import { Module } from '@nestjs/common';
import { StakeholdersService } from './stakeholders.service';
import { StakeholdersController } from './stakeholders.controller';
import { StakeholderPostsService } from './stakeholder-posts.service';
import { SocialModule } from 'src/integrations/social/social.module';

@Module({
  imports: [SocialModule],
  controllers: [StakeholdersController],
  providers: [StakeholdersService, StakeholderPostsService],
  exports: [StakeholdersService, StakeholderPostsService],
})
export class StakeholdersModule {}

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CommentService } from './subroutes/comment/comment.service';
import { CommentController } from './subroutes/comment/comment.controller';
import { LabelController } from './subroutes/label/label.controller';
import { LabelService } from './subroutes/label/label.service';
import { LabelsModule } from '../common/labels/labels.module';
import { MailModule } from 'src/integrations/mail/mail.module';

@Module({
  imports: [LabelsModule, MailModule],
  controllers: [UsersController, CommentController, LabelController],
  providers: [UsersService, CommentService, LabelService],
  exports: [UsersService],
})
export class UsersModule {}

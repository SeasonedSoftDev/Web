import { Module } from '@nestjs/common';
import { PlatformProductOrderService } from './platform-product-order.service';
import { PlatformProductController } from './platform-product.controller';
import { ClientModule } from '../client/client.module';
import { LabelsModule } from '../common/labels/labels.module';
import { InfluencerModule } from '../influencer/influencer.module';
import { CommentService } from './subroutes/comment/comment.service';
import { CommentController } from './subroutes/comment/comment.controller';
import { LabelService } from './subroutes/label/label.service';
import { LabelController } from './subroutes/label/label.controller';

@Module({
  imports: [ClientModule, InfluencerModule, LabelsModule],
  providers: [PlatformProductOrderService, CommentService, LabelService],
  controllers: [PlatformProductController, CommentController, LabelController],
  exports: [PlatformProductOrderService],
})
export class PlatformProductModule {}

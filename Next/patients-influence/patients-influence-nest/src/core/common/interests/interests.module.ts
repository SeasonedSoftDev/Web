import { Module } from '@nestjs/common';
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';

@Module({
  controllers: [InterestsController],
  providers: [InterestsService],
})
export class InterestsModule {}

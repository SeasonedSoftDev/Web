import { Module } from '@nestjs/common';
import { StrugglesService } from './struggles.service';
import { StrugglesController } from './struggles.controller';

@Module({
  controllers: [StrugglesController],
  providers: [StrugglesService],
})
export class StrugglesModule {}

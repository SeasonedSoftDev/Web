import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  imports: [UsersModule],
  exports: [FinanceService],
})
export class FinanceModule {}

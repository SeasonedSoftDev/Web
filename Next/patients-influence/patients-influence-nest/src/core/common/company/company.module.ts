import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyTitleService } from './company-title.service';
import { CompanyController } from './company.controller';

@Module({
  providers: [CompanyService, CompanyTitleService],
  controllers: [CompanyController],
})
export class CompanyModule {}

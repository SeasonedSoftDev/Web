import {
  Get,
  Post,
  Body,
  Param,
  Controller,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthUser } from '../auth/decorators';
import { TransactionFlow, User } from '@prisma/client';
import {
  CreateTransactionFlowDto,
  CreateWithdrawTransactionDto,
  FinanceQueryParamsDto,
} from './dto';
import { TransactionEntity, TransactionFlowEntity } from './entities';
import { ApiTags } from '@nestjs/swagger';
import { NoAutoSerialize } from 'src/decorators/no-auto-serialize.decorator';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { serializePaginationResult } from 'src/utils/serializers/pagination-result.serializer';
import { UpdateWithdrawTransactionDto } from './dto/update-withdraw-transaction.dto';
import { FindByIdsDto } from './dto/find-by-ids.dto';
import { CreateCustomFinanceStatementDto } from './dto/create-custom-cost-finance-statement.dto';
import { GetCustomFinanceStatementsFilterDto } from './dto/get-custom-finance-statements.dto';
import { GetCostsFilteredDto } from './dto/get-costs-filtered.dto';
import { FinanceWithdrawalsFiltersDto } from './dto/finance-withdrawals-filters.dto';
import { CustomCostFilterDto } from './dto/custom-cost-filter.dto';

@Controller('finance')
@ApiTags('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('balance')
  async getBalance(@AuthUser() user: User) {
    return this.financeService.getBalance(user.id);
  }

  @Get()
  async getAllTransactions(@Query() dto: FinanceQueryParamsDto) {
    return await this.financeService.getAllTransactions(dto);
  }

  @Get('transactions')
  async getTransactions(@AuthUser() user: User) {
    const transactions = await this.financeService.getTransactions(user.id);
    return transactions.map(
      (transaction) => new TransactionEntity(transaction),
    );
  }

  @Get('transactionFlows')
  async getTransactionFlows(@AuthUser() user: User) {
    const transactionFlows = await this.financeService.getTransactionFlows(
      user.id,
    );
    return transactionFlows.map(
      (transactionFlow) => new TransactionFlowEntity(transactionFlow),
    );
  }

  @Post('customCostFinanceStatement')
  async createCustomCostFinanceStatement(
    @Body() dto: CreateCustomFinanceStatementDto,
  ) {
    const transactionFlow =
      await this.financeService.createCustomCostFinanceStatement(dto);
    return new TransactionFlowEntity(transactionFlow);
  }

  @Post('customRevenueFinanceStatement')
  async createCustomRevenueFinanceStatement(
    @Body() dto: CreateCustomFinanceStatementDto,
  ) {
    return await this.financeService.createCustomRevenueFinanceStatement(dto);
  }

  @Post('transactionFlows')
  async createTransactionFlow(
    @AuthUser() user: User,
    @Body() dto: CreateTransactionFlowDto,
  ) {
    const transactionFlow = await this.financeService.createTransactionFlow(
      user.id,
      dto,
    );
    return new TransactionFlowEntity(transactionFlow);
  }

  @Post('bulkTransactionFlows')
  async bulkCreateTransactionFlow(@Body() dto: CreateTransactionFlowDto[]) {
    return await this.financeService.bulkCreateTransactionFlows(dto);
  }

  @Post('bulkTransactionFlows/approve')
  async bulkApproveTransactionFlow(@Body() dto: UpdateWithdrawTransactionDto) {
    return await this.financeService.bulkApproveTransactionFlows(dto);
  }

  @Post('bulkTransactionFlows/decline')
  async bulkDeclineTransactionFlow(@Body() dto: UpdateWithdrawTransactionDto) {
    return await this.financeService.bulkDeclineTransactionFlows(dto);
  }

  @Post('transactionFlows/:id/approve')
  async approveTransactionFlow(@Param('id', ParseIntPipe) id: number) {
    const transaction = await this.financeService.approveTransactionFlow(id);
    return new TransactionEntity(transaction);
  }

  @Post('transactionFlows/:id/decline')
  async declineTransactionFlow(@Param('id', ParseIntPipe) id: number) {
    const transaction = await this.financeService.declineTransactionFlow(id);
    return new TransactionEntity(transaction);
  }

  @Get('costs')
  @NoAutoSerialize()
  async getAllCosts(
    @Query() dto: FilterParamsDto,
    @Query() costFilters: GetCostsFilteredDto,
  ) {
    return serializePaginationResult<TransactionFlow, TransactionFlowEntity>(
      this.financeService.getAllPayments(dto, costFilters),
      TransactionFlowEntity,
    );
  }

  @Get('payments')
  async findAllPayments(@Query() dto: FindByIdsDto) {
    return await this.financeService.findAllPayments(dto);
  }

  @Get('withdrawals')
  async findAllWithdrawals(@Query() dto: FindByIdsDto) {
    return await this.financeService.findAllWithdraws(dto);
  }

  @Get('withdraws')
  @NoAutoSerialize()
  async getAllWithdraws(
    @Query() dto: FilterParamsDto,
    @Query() filterParamsDto: FinanceWithdrawalsFiltersDto,
  ) {
    return serializePaginationResult<TransactionFlow, TransactionFlowEntity>(
      this.financeService.getAllWithdrawRequests(dto, filterParamsDto),
      TransactionFlowEntity,
    );
  }

  @Post('withdrawFlows')
  async requestSalary(
    @AuthUser() user: User,
    @Body() dto: CreateWithdrawTransactionDto,
  ) {
    const transactionFlow = await this.financeService.createWithdrawTransaction(
      user.id,
      dto,
    );
    return new TransactionFlowEntity(transactionFlow);
  }

  @Get('customFinanceStatements')
  @NoAutoSerialize()
  async getAllCustomFinanceStatements(
    @Query() dto: GetCustomFinanceStatementsFilterDto,
    @Query() filterParams: CustomCostFilterDto,
  ) {
    return await this.financeService.findAllCustomFinanceStatements(
      dto,
      filterParams,
    );
  }

  @Post('withdrawFlows/:id/approve')
  async approveWithdrawTransactionFlow(@Param('id', ParseIntPipe) id: number) {
    const transaction =
      await this.financeService.approveWithdrawTransactionFlow(id);
    return new TransactionEntity(transaction);
  }

  @Post('withdrawFlows/:id/decline')
  async declineWithdrawTransactionFlow(@Param('id', ParseIntPipe) id: number) {
    const transaction =
      await this.financeService.declineWithdrawTransactionFlow(id);
    return new TransactionEntity(transaction);
  }

  @Post('withdrawFlows/bulkApprove')
  async bulkApproveWithdrawTransactionFlow(
    @Body() dto: UpdateWithdrawTransactionDto,
  ) {
    return await this.financeService.bulkApproveWithdrawTransactions(dto);
  }

  @Post('withdrawFlows/bulkDecline')
  async bulkDeclineWithdrawTransactionFlow(
    @Body() dto: UpdateWithdrawTransactionDto,
  ) {
    return await this.financeService.bulkDeclineWithdrawTransactions(dto);
  }
}

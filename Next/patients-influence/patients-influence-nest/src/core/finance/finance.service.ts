import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import {
  CreateTransactionFlowDto,
  CreateWithdrawTransactionDto,
  FinanceQueryParamsDto,
} from './dto';
import {
  TransactionFlowType,
  TransactionStatus,
  withSelectors,
} from 'src/utils';
import {
  TransactionInsufficientFundsUnprocessableEntityException,
  TransactionOperationBadRequestException,
} from './exceptions';
import { Decimal } from '@prisma/client/runtime';
import { NotificationsService } from '../notifications/notifications.service';
import FinanceSelectors from './selectors';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import { Prisma, Transaction, TransactionFlow } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { UpdateWithdrawTransactionDto } from './dto/update-withdraw-transaction.dto';
import { passwordValid } from '../auth/utils/password.util';
import { UsersService } from '../users/users.service';
import { FindByIdsDto } from './dto/find-by-ids.dto';
import { Status } from '../campaign/enums';
import { CreateCustomFinanceStatementDto } from './dto/create-custom-cost-finance-statement.dto';
import { GetCustomFinanceStatementsFilterDto } from './dto/get-custom-finance-statements.dto';
import { GetCostsFilteredDto } from './dto/get-costs-filtered.dto';
import { FinanceWithdrawalsFiltersDto } from './dto/finance-withdrawals-filters.dto';
import { CustomCostFilterDto } from './dto/custom-cost-filter.dto';

@Injectable()
export class FinanceService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  static queryInfluecerAmbassadorWithdraws: Prisma.TransactionFlowInclude = {
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
    transactions: {
      select: {
        status: true,
      },
    },
  };

  static queryTransactionFlows: Prisma.TransactionFlowInclude = {
    productOrder: {
      select: {
        status: true,
        campaigns: {
          select: {
            name: true,
          },
        },
        surveys: {
          select: {
            name: true,
          },
        },
      },
    },
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
    transactions: {
      select: {
        status: true,
      },
    },
  };

  async getAllTransactions(dto: FinanceQueryParamsDto) {
    const { columns, filters, pagination } = dto;

    const data = await withSelectors(
      {
        columns,
        filters,
        pagination,
        service: this.prismaService,
        context: 'transactionFlow',
      },
      FinanceSelectors,
    );

    return data;
  }

  async getTransactions(userId: number) {
    return await this.prismaService.transaction.findMany({
      where: {
        transactionFlow: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getTransactionFlows(userId: number) {
    return await this.prismaService.transactionFlow.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLastTransaction(userId: number) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        transactionFlow: {
          userId,
        },
      },
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.shift();
  }

  async getLastTransactionInFlow(transactionFlowId: number) {
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        transactionFlowId,
      },
      include: {
        transactionFlow: true,
      },
      take: 1,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.shift();
  }

  async getBalance(userId: number) {
    const balance = {
      availableAmounts: 0,
      unavailableAmounts: 0,
    };

    const lastTransaction = await this.getLastTransaction(userId);

    if (lastTransaction) {
      balance.availableAmounts = lastTransaction.availableAmounts.toNumber();
      balance.unavailableAmounts =
        lastTransaction.unavailableAmounts.toNumber();
    }

    return balance;
  }

  async createTransactionFlow(userId: number, dto: CreateTransactionFlowDto) {
    const { name, type, amount, productOrderId } = dto;

    const lastTransaction = await this.getLastTransaction(userId);

    const amounts = {
      availableAmounts: new Decimal(0),
      unavailableAmounts: new Decimal(0),
    };

    if (lastTransaction) {
      amounts.availableAmounts = lastTransaction.availableAmounts;
      amounts.unavailableAmounts = lastTransaction.unavailableAmounts;
    }

    const transactionFlow = await this.prismaService.transactionFlow.create({
      data: {
        name,
        userId,
        type,
        amount,
        productOrderId,
      },
    });

    const transaction = await this.prismaService.transaction.create({
      data: {
        transactionFlowId: transactionFlow.id,
        ...amounts,
        status: TransactionStatus.Pending,
      },
    });

    await this.notificationsService.paymentRequested(
      userId,
      transaction.id,
      transactionFlow.id,
    );

    return transactionFlow;
  }

  async approveTransactionFlow(transactionFlowId: number) {
    const lastTransactionInFlow = await this.getLastTransactionInFlow(
      transactionFlowId,
    );

    if (lastTransactionInFlow.status !== TransactionStatus.Pending) {
      throw new TransactionOperationBadRequestException(
        transactionFlowId,
        'approve',
      );
    }

    const transaction = await this.prismaService.transaction.create({
      data: {
        availableAmounts: lastTransactionInFlow.availableAmounts.add(
          lastTransactionInFlow.transactionFlow.amount,
        ),
        unavailableAmounts: lastTransactionInFlow.unavailableAmounts,
        transactionFlowId: lastTransactionInFlow.transactionFlowId,
        status: TransactionStatus.Approved,
      },
      include: {
        transactionFlow: true,
      },
    });

    if (transaction.transactionFlow.productOrderId) {
      const platformProductOrder =
        await this.prismaService.platformProductOrder.findFirst({
          where: {
            id: transaction.transactionFlow.productOrderId,
          },
          include: {
            client: true,
            platformProductOrderInfluencers: true,
          },
        });

      if (
        platformProductOrder &&
        platformProductOrder.status === Status.Finished
      ) {
        const transactionFlows =
          await this.prismaService.transactionFlow.findMany({
            where: {
              type: TransactionFlowType.Salary,
              productOrderId: platformProductOrder.id,
              transactions: {
                every: {
                  status: {
                    in: [TransactionStatus.Pending, TransactionStatus.Approved],
                  },
                },
              },
            },
            include: {
              transactions: true,
            },
          });

        const pendingTransactionsCount = transactionFlows.filter((item) => {
          const pendingTransaction = item.transactions.find(
            (item) => item.status === 0,
          );

          if (pendingTransaction) {
            return pendingTransaction;
          }
        }).length;

        const approvedTransactionsCount = transactionFlows.filter((item) => {
          const approvedTransaction = item.transactions.find(
            (item) => item.status === 1,
          );

          if (approvedTransaction) {
            return approvedTransaction;
          }
        }).length;

        if (pendingTransactionsCount === approvedTransactionsCount) {
          if (transactionFlows && transactionFlows.length) {
            const ambassador = await this.prismaService.ambassador.findUnique({
              where: {
                id: platformProductOrder.client.ambassadorId,
              },
            });

            const sum = transactionFlows.reduce(
              (acc, item) => acc + item.amount.toNumber(),
              0,
            );

            const commissionFlow = await this.createTransactionFlow(
              ambassador.userId,
              {
                name: 'Ambassador Bonus',
                productOrderId: platformProductOrder.id,
                type: TransactionFlowType.Comission,
                userId: ambassador.userId,
                amount: new Decimal(
                  (platformProductOrder.budget.toNumber() - sum) * 0.1,
                ),
              },
            );

            if (commissionFlow) {
              const lastTransactionInFlow = await this.getLastTransactionInFlow(
                commissionFlow.id,
              );

              if (lastTransactionInFlow.status !== TransactionStatus.Pending) {
                throw new TransactionOperationBadRequestException(
                  transactionFlowId,
                  'approve',
                );
              }

              const transaction = await this.prismaService.transaction.create({
                data: {
                  availableAmounts: lastTransactionInFlow.availableAmounts.add(
                    lastTransactionInFlow.transactionFlow.amount,
                  ),
                  unavailableAmounts: lastTransactionInFlow.unavailableAmounts,
                  transactionFlowId: lastTransactionInFlow.transactionFlowId,
                  status: TransactionStatus.Approved,
                },
                include: {
                  transactionFlow: true,
                },
              });

              await this.notificationsService.paymentApproved(
                commissionFlow.userId,
                transaction.id,
                transaction.transactionFlow.id,
              );
            }
          }
        }
      }
    }

    await this.notificationsService.paymentApproved(
      transaction.transactionFlow.userId,
      transaction.id,
      transaction.transactionFlow.id,
    );

    return transaction;
  }

  async declineTransactionFlow(transactionFlowId: number) {
    const lastTransactionInFlow = await this.getLastTransactionInFlow(
      transactionFlowId,
    );

    if (lastTransactionInFlow.status !== TransactionStatus.Pending) {
      throw new TransactionOperationBadRequestException(
        transactionFlowId,
        'decline',
      );
    }

    const transaction = await this.prismaService.transaction.create({
      data: {
        availableAmounts: lastTransactionInFlow.availableAmounts,
        unavailableAmounts: lastTransactionInFlow.unavailableAmounts,
        transactionFlowId: lastTransactionInFlow.transactionFlowId,
        status: TransactionStatus.Declined,
      },
      include: {
        transactionFlow: true,
      },
    });

    await this.notificationsService.paymentDeclined(
      transaction.transactionFlow.userId,
      transaction.id,
      transaction.transactionFlow.id,
    );

    return transaction;
  }

  async createWithdrawTransaction(
    userId: number,
    dto: CreateWithdrawTransactionDto,
  ) {
    const {
      bankAccountFirstName,
      bankAccountLastName,
      bankAddress,
      bankName,
      iban,
      swiftBic,
      amount,
      password,
    } = dto;

    const user = await this.usersService.findOne({ id: userId });

    // check if password is correct
    const validPassword = await passwordValid(
      password,
      user.password,
      false,
      '',
    );

    if (!validPassword) {
      throw new BadRequestException('Invalid password, please try again.');
    }
    const lastTransaction = await this.getLastTransaction(userId);

    const amounts = {
      availableAmounts: new Decimal(0),
      unavailableAmounts: new Decimal(0),
    };

    if (lastTransaction) {
      amounts.availableAmounts = lastTransaction.availableAmounts;
      amounts.unavailableAmounts = lastTransaction.unavailableAmounts;
    }

    if (amounts.availableAmounts.sub(amount).lessThan(new Decimal(0))) {
      throw new TransactionInsufficientFundsUnprocessableEntityException();
    }

    const transaction = await this.prismaService.transactionFlow.create({
      data: {
        userId,
        amount,
        type: TransactionFlowType.Withdrawal,
        transactions: {
          create: {
            status: TransactionStatus.Pending,
            availableAmounts: amounts.availableAmounts.sub(amount),
            unavailableAmounts: amounts.unavailableAmounts.add(amount),
          },
        },
      },
    });

    await this.notificationsService.withdrawRequested(userId, transaction.id);

    if (transaction) {
      await this.prismaService.influencerAmbassadorWithdraw.create({
        data: {
          bankAccountFirstName,
          bankAccountLastName,
          bankAddress,
          bankName,
          iban,
          swiftBic,
          transactionId: transaction.id,
        },
      });
    }

    return transaction;
  }

  async approveWithdrawTransactionFlow(transactionFlowId: number) {
    const lastTransactionInFlow = await this.getLastTransactionInFlow(
      transactionFlowId,
    );

    if (lastTransactionInFlow.status !== TransactionStatus.Pending) {
      throw new TransactionOperationBadRequestException(
        transactionFlowId,
        'approve',
      );
    }

    const transaction = await this.prismaService.transaction.create({
      data: {
        availableAmounts: lastTransactionInFlow.availableAmounts,
        unavailableAmounts: lastTransactionInFlow.unavailableAmounts.sub(
          lastTransactionInFlow.transactionFlow.amount,
        ),
        transactionFlowId: lastTransactionInFlow.transactionFlowId,
        status: TransactionStatus.Approved,
      },
      include: {
        transactionFlow: true,
      },
    });

    await this.notificationsService.withdrawApproved(
      transaction.transactionFlow.userId,
      transaction.id,
    );

    return transaction;
  }

  async declineWithdrawTransactionFlow(transactionFlowId: number) {
    const lastTransactionInFlow = await this.getLastTransactionInFlow(
      transactionFlowId,
    );

    if (lastTransactionInFlow.status !== TransactionStatus.Pending) {
      throw new TransactionOperationBadRequestException(
        transactionFlowId,
        'decline',
      );
    }

    const transaction = await this.prismaService.transaction.create({
      data: {
        availableAmounts: lastTransactionInFlow.availableAmounts.add(
          lastTransactionInFlow.transactionFlow.amount,
        ),
        unavailableAmounts: lastTransactionInFlow.unavailableAmounts.sub(
          lastTransactionInFlow.transactionFlow.amount,
        ),
        transactionFlowId: lastTransactionInFlow.transactionFlowId,
        status: TransactionStatus.Declined,
      },
      include: {
        transactionFlow: true,
      },
    });

    await this.notificationsService.withdrawDeclined(
      transaction.transactionFlow.userId,
      transaction.id,
    );

    return transaction;
  }

  async bulkApproveWithdrawTransactions(dto: UpdateWithdrawTransactionDto) {
    const { ids } = dto;

    const transactions: (Transaction & { transactionFlow: TransactionFlow })[] =
      [];

    for (let i = 0; i < ids.length; i++) {
      const response = await this.approveWithdrawTransactionFlow(ids[i]);
      transactions.push(response);
    }

    return transactions;
  }

  async bulkDeclineWithdrawTransactions(dto: UpdateWithdrawTransactionDto) {
    const { ids } = dto;

    const transactions: (Transaction & { transactionFlow: TransactionFlow })[] =
      [];

    for (let i = 0; i < ids.length; i++) {
      const response = await this.declineWithdrawTransactionFlow(ids[i]);
      transactions.push(response);
    }

    return transactions;
  }

  parseCustomDate(dateString: string) {
    const parts = dateString.match(/(\d+)/g);
    const year = parseInt(parts[2], 10);
    const month = parseInt(parts[0], 10) - 1; // Months are 0-based
    const day = parseInt(parts[1], 10);

    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  async getAllWithdrawRequests(
    { take, skip, sortBy }: FilterParamsDto,
    filters: FinanceWithdrawalsFiltersDto,
  ): Promise<PaginationResult<TransactionFlow>> {
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      transactions: {
        every: {
          status: {
            in: [
              TransactionStatus.Pending,
              TransactionStatus.Approved,
              TransactionStatus.Declined,
            ],
          },
        },
      },
      amount: {
        gte: filters.amountMin !== undefined ? filters.amountMin : undefined,
        lte: filters.amountMax !== undefined ? filters.amountMax : undefined,
      },
      type: TransactionFlowType.Withdrawal,
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.TransactionFlowOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    const filteredWithdrawals =
      await this.prismaService.transactionFlow.findMany({
        where: queryWhere,
        include: {
          productOrder: {},
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          transactions: {
            select: {
              status: true,
            },
          },
        },
      });

    const filteredWithdrawalIds = filteredWithdrawals
      .filter((withdrawal) => {
        let isMatch = true;

        if (filters.startDate !== undefined) {
          const parsedStartDate = this.parseCustomDate(filters.startDate);

          const databaseDate = withdrawal.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate >= parsedStartDate;
        }

        if (filters.endDate !== undefined) {
          const parsedEndDate = this.parseCustomDate(filters.endDate);

          const databaseDate = withdrawal.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate <= parsedEndDate;
        }

        if (filters.statusIds?.length) {
          let status;

          if (withdrawal.transactions.length > 1) {
            status = withdrawal.transactions[1].status;
          }

          if (withdrawal.transactions.length === 1) {
            status = withdrawal.transactions[0].status;
          }

          isMatch &&= filters.statusIds.includes(status);
        }

        return isMatch;
      })
      .map((withdrawal) => withdrawal.id);

    queryWhere.id = {
      in: filteredWithdrawalIds,
    };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.transactionFlow,
      {
        skip,
        take,
        orderBy: queryOrderBy,
        where: queryWhere,
        include: FinanceService.queryInfluecerAmbassadorWithdraws,
      },
    )();

    return res;
  }

  async getAllPayments(
    { take, skip, sortBy }: FilterParamsDto,
    filters: GetCostsFilteredDto,
  ) {
    const queryWhere: Prisma.TransactionFlowWhereInput = {
      transactions: {
        every: {
          status: {
            in: [
              TransactionStatus.Approved,
              TransactionStatus.Declined,
              TransactionStatus.Pending,
            ],
          },
        },
      },
      amount: {
        gte: filters.budgetMin !== undefined ? filters.budgetMin : undefined,
        lte: filters.budgetMax !== undefined ? filters.budgetMax : undefined,
      },
      type: TransactionFlowType.Salary,
      productOrderId: {
        not: null,
      },
      userId: {
        in: filters.influencerIds?.length ? filters.influencerIds : undefined,
      },
      productOrder: {
        campaigns: {
          some: {
            id: {
              in: filters.campaignIds?.length ? filters.campaignIds : undefined,
            },
          },
        },
        client: {
          userId: filters.clientIds?.length
            ? {
                in: filters.clientIds,
              }
            : undefined,
          companyId: filters.companyIds?.length
            ? {
                in: filters.companyIds,
              }
            : undefined,
          ambassador: filters.ambassadorIds?.length
            ? {
                userId: {
                  in: filters.ambassadorIds,
                },
              }
            : undefined,
        },
      },
    };

    const filteredPayments = await this.prismaService.transactionFlow.findMany({
      where: queryWhere,
      include: {
        productOrder: {
          select: {
            client: {
              include: {
                company: true,
                ambassador: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
            status: true,
            campaigns: {
              select: {
                name: true,
              },
            },
            surveys: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        transactions: {
          select: {
            status: true,
          },
        },
      },
    });

    const filteredTransactionIds = filteredPayments
      .filter((transaction) => {
        let isMatch = true;

        if (filters.startDate !== undefined) {
          const parsedStartDate = this.parseCustomDate(filters.startDate);

          const databaseDate = transaction.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate >= parsedStartDate;
        }

        if (filters.endDate !== undefined) {
          const parsedEndDate = this.parseCustomDate(filters.endDate);

          const databaseDate = transaction.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate <= parsedEndDate;
        }

        if (filters.statusIds?.length) {
          let status;

          if (transaction.transactions.length > 1) {
            status = transaction.transactions[1].status;
          }

          if (transaction.transactions.length === 1) {
            status = transaction.transactions[0].status;
          }

          isMatch &&= filters.statusIds.includes(status);
        }

        return isMatch;
      })
      .map((transaction) => transaction.id);

    queryWhere.id = {
      in: filteredTransactionIds,
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.TransactionFlowOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.transactionFlow,
      {
        skip,
        take,
        orderBy: queryOrderBy,
        where: queryWhere,
        include: FinanceService.queryTransactionFlows,
      },
    )();

    return res;
  }

  async bulkCreateTransactionFlows(
    dto: CreateTransactionFlowDto[],
  ): Promise<TransactionFlow[]> {
    const transactionFlows = await Promise.all(
      dto.map((x) => this.createTransactionFlow(x.userId, x)),
    );

    return transactionFlows;
  }

  async bulkApproveTransactionFlows(dto: UpdateWithdrawTransactionDto) {
    const { ids } = dto;

    const transactions: (Transaction & { transactionFlow: TransactionFlow })[] =
      [];

    for (let i = 0; i < ids.length; i++) {
      const response = await this.approveTransactionFlow(ids[i]);
      transactions.push(response);
    }

    return transactions;
  }

  async bulkDeclineTransactionFlows(dto: UpdateWithdrawTransactionDto) {
    const { ids } = dto;

    const transactions: (Transaction & { transactionFlow: TransactionFlow })[] =
      [];

    for (let i = 0; i < ids.length; i++) {
      const response = await this.declineTransactionFlow(ids[i]);
      transactions.push(response);
    }

    return transactions;
  }

  async findAllPayments(dto: FindByIdsDto) {
    const payments = await this.prismaService.transaction.findMany({
      where: {
        status: {
          in: [
            TransactionStatus.Approved,
            TransactionStatus.Declined,
            TransactionStatus.Pending,
          ],
        },
        transactionFlow: {
          type: TransactionFlowType.Salary,
          id: {
            in: dto.ids,
          },
        },
      },
      include: {
        transactionFlow: {
          include: {
            productOrder: {
              select: {
                campaigns: {
                  select: {
                    name: true,
                  },
                },
                surveys: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const status = {
      0: 'Approved',
      1: 'Declined',
      2: 'Pending',
    };

    return payments.map((payment) => {
      return {
        status: status[payment.status],
        availableAmounts: payment.availableAmounts.toNumber(),
        unavailableAmounts: payment.unavailableAmounts.toNumber(),
        createAt: payment.createdAt,
        userName: `${payment.transactionFlow.user.firstName} ${payment.transactionFlow.user.lastName}`,
        userEmail: payment.transactionFlow.user.email,
        amount: payment.transactionFlow.amount.toNumber(),
      };
    });
  }

  async findAllWithdraws(dto: FindByIdsDto) {
    const payments =
      await this.prismaService.influencerAmbassadorWithdraw.findMany({
        where: {
          transaction: {
            status: {
              in: [TransactionStatus.Approved, TransactionStatus.Pending],
            },
            transactionFlow: {
              type: TransactionFlowType.Withdrawal,
              id: {
                in: dto.ids,
              },
            },
          },
        },
        include: {
          transaction: {
            include: {
              transactionFlow: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

    return payments.map((payment) => {
      return {
        name: 'Withdrawal Request',
        recipientEmail: payment.transaction.transactionFlow.user.email,
        paymentReference: '',
        receiverType: 'PERSON',
        amountCurrency: 'source',
        amount: payment.transaction.transactionFlow.amount.toNumber(),
        sourceCurrency: 'CHF',
        targetCurrency: 'CHF',
        IBAN: payment.iban,
        BIC: payment.swiftBic,
        accountNumber: payment.accountNumber,
      };
    });
  }

  async createCustomCostFinanceStatement(dto: CreateCustomFinanceStatementDto) {
    const {
      userId,
      productOrderId,
      statementName,
      amount,
      type,
      vendor,
      statementDate,
      email,
      isBalanceChange,
      status,
    } = dto;

    let transactionFlowId = null;

    if (isBalanceChange) {
      const transactionFlow = await this.createTransactionFlow(userId, {
        amount,
        name: statementName,
        type,
        userId,
        productOrderId,
      });

      transactionFlowId = transactionFlow.id;

      if (status === 1) {
        await this.approveTransactionFlow(transactionFlow.id);
      }

      if (status === 2) {
        await this.declineTransactionFlow(transactionFlow.id);
      }
    }

    return await this.prismaService.customFinanceStatement.create({
      data: {
        amount,
        email,
        isBalanceChange,
        productOrderId,
        statementDate,
        statementName,
        userId,
        vendor,
        type: 0,
        transactionFlowId,
      },
    });
  }

  async createCustomRevenueFinanceStatement(
    dto: CreateCustomFinanceStatementDto,
  ) {
    const {
      userId,
      productOrderId,
      statementName,
      amount,
      statementDate,
      status,
      email,
    } = dto;

    await this.prismaService.platformProductOrder.update({
      where: {
        id: productOrderId,
      },
      data: {
        financeStatus: status,
      },
    });

    return await this.prismaService.customFinanceStatement.create({
      data: {
        amount,
        email,
        productOrderId,
        statementDate,
        statementName,
        userId,
        type: 1,
      },
    });
  }

  async findAllCustomFinanceStatements(
    { skip, take, sortBy, type }: GetCustomFinanceStatementsFilterDto,
    filters: CustomCostFilterDto,
  ) {
    const queryWhere: Prisma.CustomFinanceStatementWhereInput = {
      type,
      amount: {
        gte: filters.budgetMin !== undefined ? filters.budgetMin : undefined,
        lte: filters.budgetMax !== undefined ? filters.budgetMax : undefined,
      },
      transactionFlow:
        filters.typeIds !== undefined ||
        filters.influencerIds !== undefined ||
        filters.campaignIds !== undefined ||
        filters.clientIds ||
        filters.companyIds ||
        filters.ambassadorIds
          ? {
              type: filters.typeIds?.length
                ? {
                    in: filters.typeIds,
                  }
                : undefined,
              productOrderId: {
                not: null,
              },

              OR: [
                {
                  userId: {
                    in: filters.influencerIds?.length
                      ? filters.influencerIds
                      : undefined,
                  },
                },
                {
                  userId: {
                    in: filters.ambassadorIds?.length
                      ? filters.ambassadorIds
                      : undefined,
                  },
                },
                {
                  userId: {
                    in: filters.clientIds?.length
                      ? filters.clientIds
                      : undefined,
                  },
                },
                {
                  productOrder: {
                    client: {
                      userId: filters.clientIds?.length
                        ? {
                            in: filters.clientIds,
                          }
                        : undefined,
                      companyId: filters.companyIds?.length
                        ? {
                            in: filters.companyIds,
                          }
                        : undefined,
                      ambassador: filters.ambassadorIds?.length
                        ? {
                            userId: {
                              in: filters.ambassadorIds,
                            },
                          }
                        : undefined,
                    },
                  },
                },
              ],
            }
          : undefined,
    };

    const filteredCustomCosts =
      await this.prismaService.customFinanceStatement.findMany({
        where: queryWhere,
        include: {
          platformProductOrder: {
            include: {
              campaigns: true,
              surveys: true,
            },
          },
          user: true,
          transactionFlow: {
            include: {
              transactions: true,
            },
          },
        },
      });

    const queryInclude: Prisma.CustomFinanceStatementInclude = {
      platformProductOrder: {
        include: {
          campaigns: true,
          surveys: true,
        },
      },
      user: true,
      transactionFlow: {
        select: {
          type: true,
          productOrder: {
            select: {
              client: {
                include: {
                  company: true,
                  ambassador: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                        },
                      },
                    },
                  },
                },
              },
              status: true,
              campaigns: {
                select: {
                  name: true,
                },
              },
              surveys: {
                select: {
                  name: true,
                },
              },
            },
          },
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          transactions: {
            select: {
              status: true,
            },
          },
        },
      },
    };

    const filteredCustomTransactionIds = filteredCustomCosts
      .filter((transaction) => {
        let isMatch = true;

        if (filters.startDate !== undefined) {
          const parsedStartDate = this.parseCustomDate(filters.startDate);

          const databaseDate = transaction.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate >= parsedStartDate;
        }

        if (filters.endDate !== undefined) {
          const parsedEndDate = this.parseCustomDate(filters.endDate);

          const databaseDate = transaction.updatedAt;
          databaseDate.setUTCHours(0, 0, 0, 0);

          isMatch &&= databaseDate <= parsedEndDate;
        }

        if (filters.statusIds?.length) {
          let status;

          if (transaction.transactionFlow.transactions.length > 1) {
            status = transaction.transactionFlow.transactions[1].status;
          }

          if (transaction.transactionFlow.transactions.length === 1) {
            status = transaction.transactionFlow.transactions[0].status;
          }

          isMatch &&= filters.statusIds.includes(status);
        }

        if (filters.campaignIds === undefined && filters.surveyIds?.length) {
          isMatch &&= transaction.platformProductOrder.surveys.some((survey) =>
            filters.surveyIds.includes(survey.id),
          );
        }

        if (filters.surveyIds === undefined && filters.campaignIds?.length) {
          isMatch &&= transaction.platformProductOrder.campaigns.some(
            (campaign) => filters.campaignIds.includes(campaign.id),
          );
        }

        if (
          filters.surveyIds !== undefined &&
          filters.campaignIds !== undefined
        ) {
          const existingCampaign =
            transaction.platformProductOrder.campaigns.some((campaign) =>
              filters.campaignIds.includes(campaign.id),
            );

          const existingSurvey = transaction.platformProductOrder.surveys.some(
            (survey) => filters.surveyIds.includes(survey.id),
          );

          isMatch &&= existingCampaign || existingSurvey;
        }
        return isMatch;
      })
      .map((transaction) => transaction.id);

    queryWhere.id = {
      in: filteredCustomTransactionIds,
    };

    const queryOrderBy: Prisma.Enumerable<Prisma.CustomFinanceStatementOrderByWithRelationInput> =
      (sortBy as any) || { createdAt: 'desc' };

    const res = await filterRecordsFactory(
      this.prismaService,
      (tx) => tx.customFinanceStatement,
      {
        where: queryWhere,
        skip,
        take,
        include: queryInclude,
        orderBy: queryOrderBy,
      },
    )();

    return res;
  }
}

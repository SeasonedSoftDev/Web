import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../integrations/prisma/prisma.service';
import { CreateCompanyDto } from './dto';
import { Company, CompanyTitle, Prisma, User } from '@prisma/client';
import { filterRecordsFactory } from 'src/utils/factories/filter-records.factory';
import { PaginationResult } from 'src/utils/object-definitions/results/pagination-result';
import { FilterParamsDto } from 'src/utils/object-definitions/dtos/filter-params.dto';
import {
  CompanyApprovalStatus,
  CompanyFilterParamsDto,
} from './dto/query/company-filter-params.dto';
import { UserRole } from 'src/utils';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCompanies(dto: CreateCompanyDto[], creator: User) {
    try {
      const companies = dto.map((company: CreateCompanyDto) => {
        const { name, isCommon } = company;
        return {
          name,
          isCommon,
          // * only super admin can have approved status by default
          isApproved: creator.role === UserRole.SuperAdmin,
          createdByClientId: creator.id,
        };
      });

      return await this.prismaService.company.createMany({
        data: companies,
        skipDuplicates: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async findOneById(id: number) {
    try {
      return await this.prismaService.company.findUniqueOrThrow({
        where: { id },
        include: { createdByUser: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    { skip, take, sortBy, search }: FilterParamsDto,
    { approvalStatus }: CompanyFilterParamsDto,
  ): Promise<PaginationResult<Company>> {
    const queryWhere: Prisma.CompanyWhereInput = {
      name: { contains: search, mode: 'insensitive' },
      isApproved:
        approvalStatus !== undefined
          ? approvalStatus === CompanyApprovalStatus.Approved
            ? true
            : false
          : undefined,
    };
    const queryInclude: Prisma.CompanyInclude = { createdByUser: true };
    const queryOrderBy: Prisma.Enumerable<Prisma.CompanyOrderByWithRelationInput> =
      (sortBy as any) || { name: 'asc' };

    try {
      return await filterRecordsFactory(
        this.prismaService,
        (tx) => tx.company,
        {
          where: queryWhere,
          include: queryInclude,
          skip,
          take,
          orderBy: queryOrderBy,
        },
      )();
    } catch (error) {
      throw error;
    }
  }

  async updateOne(id: number, dto: UpdateCompanyDto) {
    return await this.prismaService.company.update({
      where: { id },
      data: dto,
      include: { createdByUser: true },
    });
  }

  async deleteOne(id: number) {
    return await this.prismaService.company.delete({
      where: { id },
    });
  }

  async deleteMany(ids: number[]) {
    return await this.prismaService.company.deleteMany({
      where: { id: { in: ids } },
    });
  }
}

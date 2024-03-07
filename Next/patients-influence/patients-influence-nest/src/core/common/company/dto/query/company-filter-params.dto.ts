import { IsEnum, IsOptional } from 'class-validator';

export enum CompanyApprovalStatus {
  Approved = 'Approved',
  PendingApproval = 'PendingApproval',
}

export class CompanyFilterParamsDto {
  @IsOptional()
  @IsEnum(CompanyApprovalStatus)
  approvalStatus?: CompanyApprovalStatus;
}

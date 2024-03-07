import { IsArray, IsInt } from 'class-validator';

export class UpdateWithdrawTransactionDto {
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}

import { IsArray, IsInt } from 'class-validator';

export class ReceivePendingRevenuesDto {
  @IsArray()
  @IsInt({ each: true })
  productIds: number[];
}

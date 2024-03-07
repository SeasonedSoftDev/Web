import { IsInt, IsPositive } from 'class-validator';

export class AddInfluencersDto {
  @IsInt()
  @IsPositive()
  productOrderId: number;

  @IsInt()
  @IsPositive()
  influencerId: number;
}

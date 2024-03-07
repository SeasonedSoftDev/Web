import { IsInt, IsPositive } from 'class-validator';

export class FetchRoomDto {
  @IsInt()
  @IsPositive()
  productOrderId: number;
}

import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSMLDto } from './create-sml.dto';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateSMLDto extends PartialType(
  OmitType(CreateSMLDto, [] as const),
) {
  @IsInt()
  @IsPositive()
  status: number;
}

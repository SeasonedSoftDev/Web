import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class GetInfluencerDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.includeDetailedInfo === 'true' ? true : false))
  includeDetailedInfo?: boolean = true;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.includeAffiliates === 'true' ? true : false))
  includeAffiliates?: boolean = true;
}

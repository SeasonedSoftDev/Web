import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';

export class GetAmbassadorDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.includeAffiliates === 'true' ? true : false))
  includeAffiliates?: boolean = true;
}

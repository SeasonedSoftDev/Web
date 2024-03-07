import { PartialType } from '@nestjs/swagger';
import { CreateBenefitDto } from './create-benefit.dto';

export class LocationDto {
  locationId: number;
}

export class EditBenefitDto extends PartialType(CreateBenefitDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateInterestDto } from './create-interest.dto';

export class UpdateInterestDto extends PartialType(CreateInterestDto) {}

import { PartialType } from '@nestjs/swagger';
import { CreateInfluencerSizeDto } from './create-influencer-size.dto';

export class UpdateInfluencerSizeDto extends PartialType(
  CreateInfluencerSizeDto,
) {}

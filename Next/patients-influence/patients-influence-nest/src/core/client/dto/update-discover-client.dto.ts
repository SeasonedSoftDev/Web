import { PartialType } from '@nestjs/swagger';
import { CreateDiscoverClientDto } from './create-discover-client.dto';

export class UpdateDiscoverClientDto extends PartialType(
  CreateDiscoverClientDto,
) {}

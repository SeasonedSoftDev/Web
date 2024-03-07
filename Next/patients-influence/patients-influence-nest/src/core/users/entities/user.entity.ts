import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { objectEnumValues } from '@prisma/client/runtime';
import { Exclude, Transform } from 'class-transformer';
import { ClientEntity } from 'src/core/client/entities/client.entity';
import { LocationEntity } from 'src/core/common/location/entities/location.entity';
import { InfluencerEntity } from 'src/core/influencer/entities/influencer.entity';
import { UserRole } from 'src/utils';

// * exclude whatever won't be shown in any case, but will be used within the api business logic
export class UserEntity implements Partial<User> {
  id: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  emailResendTokens: number;

  @ApiHideProperty()
  @Exclude()
  password: string;

  locationId: number;

  @ApiProperty({
    description: 'User role such as Admin, Influencer etc.',
    enum: UserRole,
  })
  role: number;

  /* @ApiHideProperty()
  @Exclude() */
  status: number;

  @ApiHideProperty()
  @Exclude()
  isDeleted: boolean;

  @ApiProperty({ description: 'Desired currency for a withdrawal purposes' })
  currency: number;

  createdAt: Date;
  updatedAt: Date;

  influencer?: InfluencerEntity;
  client?: ClientEntity;

  /* @Transform((obj) =>
    obj.value !== null ? new LocationEntity(obj.value) : obj.value,
  ) */
  location?: LocationEntity;

  constructor({ influencer, client, location, ...data }: Partial<UserEntity>) {
    Object.assign(this, data);

    if (influencer) this.influencer = new InfluencerEntity(influencer);
    if (client) this.client = new ClientEntity(client);
    if (location) this.location = new LocationEntity(location);
  }
}

import { NotFoundException } from '@nestjs/common';
import {
  TUserBasicInfo,
  userIdentity,
} from 'src/core/users/utils/user-identity';

export class InfluencerNotFoundException extends NotFoundException {
  constructor({ id, email }: TUserBasicInfo) {
    let message = `Influencer does not exist`;
    const user = userIdentity({ id, email });

    if (user !== undefined) {
      message = `Influencer ${user} does not exist`;
    }

    super(message);
  }
}

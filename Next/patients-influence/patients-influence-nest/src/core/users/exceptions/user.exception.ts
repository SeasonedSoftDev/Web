import { NotFoundException } from '@nestjs/common';
import { TUserBasicInfo, userIdentity } from '../utils/user-identity';

export class UserNotFoundException extends NotFoundException {
  constructor({ id, email }: TUserBasicInfo) {
    let message = `User does not exist`;
    const user = userIdentity({ id, email });

    if (user !== undefined) {
      message = `User ${user} does not exist`;
    }

    super(message);
  }
}

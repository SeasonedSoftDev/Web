import { ApplicationException } from 'src/exceptions/application.exception';

export class SocialPlatformException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

export class SocialPlatformUnchangeableException extends SocialPlatformException {
  constructor(message: string) {
    super(message);
  }
}

export class SocialPlatformMissingDataException extends SocialPlatformException {
  constructor(message: string) {
    super(message);
  }
}

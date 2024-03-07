import { ApplicationException } from 'src/exceptions/application.exception';

export class StakeholderException extends ApplicationException {
  constructor(message: string) {
    super(message);
  }
}

import { ForbiddenApplicationException } from 'src/exceptions/application.exception';

export class CampaignHasFinished extends ForbiddenApplicationException {
  constructor(message?: string, data?: any) {
    const msg = 'Campaign has finished';
    message = message ? `${message}: ${msg}` : msg;
    super(message, data);
  }
}

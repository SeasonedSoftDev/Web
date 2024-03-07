import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string | number {
    return HttpStatus.OK;
  }
}

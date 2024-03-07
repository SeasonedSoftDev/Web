import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class TransactionTypeNotFoundException extends NotFoundException {
  constructor(typeId: number) {
    const message = `Statement type ${typeId} does not exist!`;
    super(message);
  }
}

export class TransactionOperationBadRequestException extends BadRequestException {
  constructor(transactionId: number, action: string) {
    const message = `Action "${action}" cannot be done on transaction "${transactionId}"`;
    super(message);
  }
}

export class TransactionInsufficientFundsUnprocessableEntityException extends UnprocessableEntityException {
  constructor() {
    const message = `Insufficient funds`;
    super(message);
  }
}

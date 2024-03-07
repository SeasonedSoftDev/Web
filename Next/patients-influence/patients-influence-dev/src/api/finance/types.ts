export interface CreateWithdrawRequest {
  amount: any;
  bankAccountFirstName: string;
  bankAccountLastName: string;
  bankName: string;
  bankAddress: string;
  password: string;
  iban?: string;
  swift?: string;
  accountNumber?: string;
}

export interface CreateTransactionFlow {
  amount: number;
  productOrderId: number;
  type: number;
}

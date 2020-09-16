export interface SendTransactionToExternalAccountOptions {
  privateKey?: string;
  transactionConfirmationBlocks?: number;
  onlyGetTxHash?: boolean;
}

export interface GetTransactionsByAccountOptions {
  startBlockNumber: number;
  endBlockNumber?: number;
  include?: "from" | "to" | "both";
}
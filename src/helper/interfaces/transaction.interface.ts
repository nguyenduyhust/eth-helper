export { Transaction } from "web3-core";

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

export interface ITokenTransferArgs {
  senderAddr: string;
  receiverAddr: string;
  tokenInfo: ITokenInfo;
  amount: string;
  gasPrice?: number;
  gasLimit?: number;
  data?: string;
}

export interface ITokenInfo {
  id: number;
  name: string;
  symbol: string;
  decimals?: number;
  icon?: string;
  address: string;
}

export interface INFTokenTransferArgs {
  from: string;
  to: string;
  tokenInfo: ITokenInfo;
  gasPrice?: number;
  gasLimit?: number;
  data?: string;
}

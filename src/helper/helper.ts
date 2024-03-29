var HttpProvider = require("web3-providers-http");
var Eth = require("web3-eth");
// import { Eth } from "web3-eth";
import {
  Account,
  TransactionConfig,
  SignedTransaction,
  TransactionReceipt,
  provider,
  Transaction,
} from "web3-core";
import * as Web3Utils from "web3-utils";

import { EthUtils } from "../utils";
import {
  GetTransactionsByAccountOptions,
  SendTransactionToExternalAccountOptions,
  INFTokenTransferArgs,
} from "./interfaces";

export interface FactoryArgs {
  provider?: provider;
  httpProviderHost?: string;
  privateKey?: string;
  abi?: Web3Utils.AbiItem[];
  options?: {
    defaultTransactionConfirmationBlocks?: number;
  };
}

export class EthHelper {
  private eth: any;
  // private eth: Eth;
  private defaultAccount?: Account;
  private defaultTransactionConfirmationBlocks: number;
  private tokenContract: any;

  protected constructor(
    provider: provider,
    privateKey?: string,
    abi?: Web3Utils.AbiItem[],
    options?: {
      defaultTransactionConfirmationBlocks?: number;
    }
  ) {
    const { defaultTransactionConfirmationBlocks } = options || {};
    this.eth = new Eth(provider);
    if (privateKey) {
      this.defaultAccount = this.eth.accounts.privateKeyToAccount(privateKey);
    }
    if (defaultTransactionConfirmationBlocks) {
      this.eth.transactionConfirmationBlocks = defaultTransactionConfirmationBlocks;
    }
    this.defaultTransactionConfirmationBlocks = this.eth.transactionConfirmationBlocks;
    if (abi) {
      this.tokenContract = new this.eth.Contract(abi);
    }
  }

  public static factoryMethod(args: FactoryArgs = {}) {
    const { httpProviderHost, privateKey, options } = args;
    let provider;
    if (args.provider) {
      provider = args.provider;
    }
    if (args.httpProviderHost) {
      provider = new HttpProvider(httpProviderHost);
    }
    if (!provider) {
      throw Error("Provider is missing");
    }

    return new EthHelper(provider, privateKey, args.abi, options);
  }

  /**
   * Get ETH balance
   * @param accountAddress Account Address
   * @returns eth balance
   */
  public async getEtherBalance(accountAddress: string) {
    const balance = await this.eth.getBalance(accountAddress);
    return Web3Utils.fromWei(balance, "ether");
  }

  public async getWeiBalance(accountAddress: string) {
    return this.eth.getBalance(accountAddress);
  }

  public generateAccount(privateKey: string) {
    return this.eth.accounts.privateKeyToAccount(privateKey);
  }

  public resetTransactionConfirmationBlocks() {
    this.eth.transactionConfirmationBlocks = this.defaultTransactionConfirmationBlocks;
  }

  public setDefaultTransactionConfirmationBlocks(
    transactionConfirmationBlocks: number
  ) {
    this.defaultTransactionConfirmationBlocks = transactionConfirmationBlocks;
    this.eth.transactionConfirmationBlocks = transactionConfirmationBlocks;
  }

  public getAccounts() {
    return this.eth.getAccounts();
  }

  public setProvider(provider: provider): boolean {
    return this.eth.setProvider(provider);
  }

  public setDefaultAccount(privateKey: string) {
    this.defaultAccount = this.eth.accounts.privateKeyToAccount(privateKey);
  }

  public getPendingTransactions(): Promise<Transaction[]> {
    return this.eth.getPendingTransactions();
  }

  public getLastBlockNumber(): Promise<number> {
    return this.eth.getBlockNumber();
  }

  public async sendTransactionToExternalAccount(
    transactionConfig: Omit<TransactionConfig, "data">,
    options?: SendTransactionToExternalAccountOptions
  ): Promise<string | TransactionReceipt> {
    const { privateKey, transactionConfirmationBlocks, onlyGetTxHash } =
      options || {};
    const account = privateKey
      ? this.generateAccount(privateKey)
      : this.defaultAccount;
    if (!account) {
      throw Error("Private key or default account is missing");
    }
    // Sign transaction
    const signedTransaction: SignedTransaction = await this.eth.accounts.signTransaction(
      {
        ...transactionConfig,
        from: account.address,
        gas:
          transactionConfig.gas ||
          (await this.eth.estimateGas(transactionConfig)),
      },
      EthUtils.hexStringFull(account.privateKey)
    );
    if (
      !signedTransaction.rawTransaction ||
      !signedTransaction.transactionHash
    ) {
      throw Error("Send transaction fail");
    }
    if (onlyGetTxHash) {
      return signedTransaction.transactionHash;
    }
    if (transactionConfirmationBlocks) {
      this.eth.transactionConfirmationBlocks = transactionConfirmationBlocks;
    }
    const transactionReceipt = await this.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    this.resetTransactionConfirmationBlocks();
    return transactionReceipt;
  }

  public async getTransactionInBlock(
    blockNumber: number
  ): Promise<Transaction[]> {
    const block = await this.eth.getBlock(blockNumber, true);
    return block.transactions;
  }

  public async getTransactions(
    startBlockNumber: number,
    endBlockNumber?: number
  ): Promise<Transaction[]> {
    if (!endBlockNumber) {
      endBlockNumber = await this.getLastBlockNumber();
    }
    if (startBlockNumber > endBlockNumber) {
      throw new Error("Start block number must be less than end block number");
    }
    const transactions: Transaction[] = [];
    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      const block = await this.eth.getBlock(i, true);
      transactions.push(...block.transactions);
    }
    return transactions;
  }

  public async getTransactionsByAccount(
    accountAddress: string,
    options: GetTransactionsByAccountOptions
  ): Promise<Transaction[]> {
    const {
      startBlockNumber,
      endBlockNumber = await this.eth.getBlockNumber(),
      include,
    } = options;
    const transactions: Transaction[] = [];
    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      const block = await this.eth.getBlock(i, true);
      transactions.push(
        ...block.transactions.filter((tx: Transaction) =>
          include === "from"
            ? tx.from === accountAddress
            : include === "to"
            ? tx.to === accountAddress
            : tx.to === accountAddress || tx.from === accountAddress
        )
      );
    }
    return transactions;
  }

  public async isAccountSendingTransaction(
    accountAddress: string
  ): Promise<boolean> {
    const transactions = await this.getPendingTransactions();
    return Boolean(transactions.find((tx) => tx.from === accountAddress));
  }

  public async getTransactionByHash(hash: string): Promise<Transaction> {
    return await this.eth.getTransaction(hash);
  }

  public async sendNFToken(args: INFTokenTransferArgs, privateKey?: string) {
    args.from = EthUtils.hexStringFull(args.from);
    args.to = EthUtils.hexStringFull(args.to);
    if (!args.tokenInfo.address || !args.tokenInfo.id) {
      return this.sendTransactionToExternalAccount(args);
    }
    this.tokenContract.options.address = args.tokenInfo.address;
    const data = this.tokenContract.methods
      .transfer(args.to, args.tokenInfo.id)
      .encodeABI();
    const rawTx: TransactionConfig = {
      from: args.from,
      gasPrice: await this.eth.getGasPrice(),
      to: EthUtils.hexStringFull(args.tokenInfo.address),
      gas: "0x00",
      data: data,
    };
    const gas = await this.eth.estimateGas(rawTx);

    // Check if current balance is enough to send a tx
    const gasPrice = parseFloat(
      Web3Utils.fromWei(
        Web3Utils.toWei((args.gasPrice || 21).toString(), "gwei"),
        "ether"
      )
    );
    const currentBalance = await this.getEtherBalance(args.from);

    if (parseFloat(currentBalance) < gasPrice * gas) {
      throw new Error("balance_not_enough");
    }

    const account = privateKey
      ? this.generateAccount(privateKey)
      : this.defaultAccount;

    rawTx.gas = Web3Utils.toHex(gas);
    const signedData: any = await this.eth.accounts.signTransaction(
      rawTx,
      account.privateKey
    );
    const transactionReceipt = await this.eth.sendSignedTransaction(
      signedData.rawTransaction
    );
    return transactionReceipt;
  }
}

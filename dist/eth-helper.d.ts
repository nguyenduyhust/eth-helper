import { TransactionConfig, TransactionReceipt, provider, Transaction } from "web3-core";
export interface SendTransactionToExternalAccountOptions {
    privateKey?: string;
    transactionConfirmationBlocks?: number;
    onlyGetTxHash?: boolean;
}
export interface FactoryArgs {
    provider?: provider;
    httpProviderHost?: string;
    privateKey?: string;
    options?: {
        defaultTransactionConfirmationBlocks?: number;
    };
}
export interface GetTransactionsByAccountOptions {
    startBlockNumber: number;
    endBlockNumber?: number;
    include?: "from" | "to" | "both";
}
export declare class EthHelper {
    private eth;
    private defaultAccount?;
    private defaultTransactionConfirmationBlocks;
    constructor(provider: provider, privateKey?: string, options?: {
        defaultTransactionConfirmationBlocks?: number;
    });
    static factoryMethod(args?: FactoryArgs): EthHelper;
    /**
     * Get ETH balance
     * @param accountAddress Account Address
     * @returns eth balance
     */
    getEtherBalance(accountAddress: string): Promise<string>;
    getWeiBalance(accountAddress: string): Promise<any>;
    generateAccount(privateKey: string): any;
    resetTransactionConfirmationBlocks(): void;
    setDefaultTransactionConfirmationBlocks(transactionConfirmationBlocks: number): void;
    getAccounts(): any;
    setProvider(provider: provider): boolean;
    setDefaultAccount(privateKey: string): void;
    getPendingTransactions(): Promise<Transaction[]>;
    sendTransactionToExternalAccount(transactionConfig: Omit<TransactionConfig, "data">, options?: SendTransactionToExternalAccountOptions): Promise<string | TransactionReceipt>;
    getTransactionsByAccount(accountAddress: string, options: GetTransactionsByAccountOptions): Promise<Transaction[]>;
    isAccountSendingTransaction(accountAddress: string): Promise<boolean>;
}

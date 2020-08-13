import { Account } from "web3-core";
export declare class EthUtils {
    static hexStringFull(value: string): string;
    static hexStringShort(value: string): string;
    static padLeft(value: string, length: number, fill?: string): string;
    static privateKeyToAccount(privateKey: string): Account;
}

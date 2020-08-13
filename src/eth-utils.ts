const Accounts = require("web3-eth-accounts");
import { Account } from "web3-core";

export class EthUtils {
  public static hexStringFull(value: string) {
    return !value || typeof value !== "string" || value.match(/^0x/)
      ? value
      : "0x" + value;
  }

  public static hexStringShort(value: string) {
    return value && typeof value === "string" && value.match(/^0x/)
      ? value.substr(2)
      : value;
  }

  public static padLeft(value: string, length: number, fill?: string) {
    if (typeof value !== "string") {
      return "";
    }
    return value.padStart(length, fill);
  }

  public static privateKeyToAccount(privateKey: string): Account {
    const accounts = new Accounts("");
    return accounts.privateKeyToAccount(EthUtils.hexStringFull(privateKey));
  }
}

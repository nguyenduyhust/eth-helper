import * as Web3Utils from "web3-utils";
import * as BN from "bn.js";
import { TransactionReceipt } from "web3-core";
const Ganache = require("ganache-core");
// import Ganache from "ganache-core";
import { EthHelper } from "../eth-helper";
import { EthUtils } from "../eth-utils";

describe("Web3 Helper", () => {
  describe("getEtherBalance", () => {
    const account1 = EthUtils.privateKeyToAccount(
      "bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7"
    );
    const account1EtherBalance = "100";
    const web3Helper = EthHelper.factoryMethod({
      provider: Ganache.provider({
        accounts: [
          {
            secretKey: EthUtils.hexStringFull(account1.privateKey),
            balance: Web3Utils.toWei(account1EtherBalance, "ether"),
          },
        ],
      }),
      privateKey: account1.privateKey,
    });

    test("Success", async (done) => {
      expect(await web3Helper.getEtherBalance(account1.address)).toEqual(
        account1EtherBalance
      );
      done();
    });
  });

  describe("sendTransaction", () => {
    const account1 = EthUtils.privateKeyToAccount(
      "bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7"
    );
    const account1EtherBalance = "100";
    const account2 = EthUtils.privateKeyToAccount(
      "cd7db44224eb86096327e544063818c7148b892e6ddbeec29448bb7099cdc541"
    );
    const account2EtherBalance = "100";
    const web3Helper = EthHelper.factoryMethod({
      provider: Ganache.provider({
        accounts: [
          {
            secretKey: EthUtils.hexStringFull(account1.privateKey),
            balance: Web3Utils.toWei(account1EtherBalance, "ether"),
          },
          {
            secretKey: EthUtils.hexStringFull(account2.privateKey),
            balance: Web3Utils.toWei(account2EtherBalance, "ether"),
          },
        ],
      }),
      privateKey: account1.privateKey,
    });

    test("Success", async (done) => {
      const amountEtherToSend = "1";
      const transactionReceipt = (await web3Helper.sendTransactionToExternalAccount(
        {
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }
      )) as TransactionReceipt;
      expect(transactionReceipt.blockHash).toBeDefined();
      expect(transactionReceipt.from).toEqual(account1.address.toLowerCase());
      expect(transactionReceipt.to).toEqual(account2.address.toLowerCase());
      const newAccount1Balance = await web3Helper.getEtherBalance(
        account1.address
      );
      const newAccount2Balance = await web3Helper.getEtherBalance(
        account2.address
      );
      expect(
        new BN(newAccount2Balance)
          .sub(new BN(account2EtherBalance))
          .eq(new BN(amountEtherToSend))
      ).toBeTruthy();
      expect(
        new BN(account1EtherBalance)
          .sub(new BN(newAccount1Balance))
          .lt(new BN(amountEtherToSend))
      ).toBeTruthy();
      done();
    });
  });

  describe("getTransactionsByAccount", () => {
    const account1 = EthUtils.privateKeyToAccount(
      "bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7"
    );
    const account1EtherBalance = "100";
    const account2 = EthUtils.privateKeyToAccount(
      "cd7db44224eb86096327e544063818c7148b892e6ddbeec29448bb7099cdc541"
    );
    const account2EtherBalance = "100";
    const web3Helper = EthHelper.factoryMethod({
      provider: Ganache.provider({
        accounts: [
          {
            secretKey: EthUtils.hexStringFull(account1.privateKey),
            balance: Web3Utils.toWei(account1EtherBalance, "ether"),
          },
          {
            secretKey: EthUtils.hexStringFull(account2.privateKey),
            balance: Web3Utils.toWei(account2EtherBalance, "ether"),
          },
        ],
      }),
      privateKey: account1.privateKey,
    });
    test("success", async (done) => {
      const amountEtherToSend = "1";
      const transactionReceipt1 = (await web3Helper.sendTransactionToExternalAccount(
        {
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }
      )) as TransactionReceipt;
      const transactionReceipt2 = (await web3Helper.sendTransactionToExternalAccount(
        {
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }
      )) as TransactionReceipt;
      const transactionReceipt3 = (await web3Helper.sendTransactionToExternalAccount(
        {
          to: account1.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        },
        { privateKey: account2.privateKey }
      )) as TransactionReceipt;

      const sentFromAccount1Transactions = await web3Helper.getTransactionsByAccount(
        account1.address,
        {
          startBlockNumber: 0,
          include: "from",
        }
      );
      expect(sentFromAccount1Transactions).toEqual([
        expect.objectContaining({
          blockHash: transactionReceipt1.blockHash,
          blockNumber: transactionReceipt1.blockNumber,
          from: account1.address,
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
        expect.objectContaining({
          blockHash: transactionReceipt2.blockHash,
          blockNumber: transactionReceipt2.blockNumber,
          from: account1.address,
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
      ]);

      const sentToAccoun1Transactions = await web3Helper.getTransactionsByAccount(
        account1.address,
        {
          startBlockNumber: 0,
          include: "to",
        }
      );
      expect(sentToAccoun1Transactions).toEqual([
        expect.objectContaining({
          blockHash: transactionReceipt3.blockHash,
          blockNumber: transactionReceipt3.blockNumber,
          from: account2.address,
          to: account1.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
      ]);

      const relatedToAccount1Transactions = await web3Helper.getTransactionsByAccount(
        account1.address,
        {
          startBlockNumber: 0,
          include: "both",
        }
      );
      expect(relatedToAccount1Transactions).toEqual([
        expect.objectContaining({
          blockHash: transactionReceipt1.blockHash,
          blockNumber: transactionReceipt1.blockNumber,
          from: account1.address,
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
        expect.objectContaining({
          blockHash: transactionReceipt2.blockHash,
          blockNumber: transactionReceipt2.blockNumber,
          from: account1.address,
          to: account2.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
        expect.objectContaining({
          blockHash: transactionReceipt3.blockHash,
          blockNumber: transactionReceipt3.blockNumber,
          from: account2.address,
          to: account1.address,
          value: Web3Utils.toWei(amountEtherToSend, "ether"),
        }),
      ]);

      done();
    });
  });

  // Ganache hasn't support this function yet
  describe.skip("isAccountSendingTransaction", () => {});
});

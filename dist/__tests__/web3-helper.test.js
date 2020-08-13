"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Web3Utils = require("web3-utils");
var BN = require("bn.js");
var Ganache = require("ganache-core");
// import Ganache from "ganache-core";
var eth_helper_1 = require("../eth-helper");
var eth_utils_1 = require("../eth-utils");
describe("Web3 Helper", function () {
    describe("getEtherBalance", function () {
        var account1 = eth_utils_1.EthUtils.privateKeyToAccount("bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7");
        var account1EtherBalance = "100";
        var web3Helper = eth_helper_1.EthHelper.factoryMethod({
            provider: Ganache.provider({
                accounts: [
                    {
                        secretKey: eth_utils_1.EthUtils.hexStringFull(account1.privateKey),
                        balance: Web3Utils.toWei(account1EtherBalance, "ether"),
                    },
                ],
            }),
            privateKey: account1.privateKey,
        });
        test("Success", function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, web3Helper.getEtherBalance(account1.address)];
                    case 1:
                        _a.apply(void 0, [_b.sent()]).toEqual(account1EtherBalance);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("sendTransaction", function () {
        var account1 = eth_utils_1.EthUtils.privateKeyToAccount("bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7");
        var account1EtherBalance = "100";
        var account2 = eth_utils_1.EthUtils.privateKeyToAccount("cd7db44224eb86096327e544063818c7148b892e6ddbeec29448bb7099cdc541");
        var account2EtherBalance = "100";
        var web3Helper = eth_helper_1.EthHelper.factoryMethod({
            provider: Ganache.provider({
                accounts: [
                    {
                        secretKey: eth_utils_1.EthUtils.hexStringFull(account1.privateKey),
                        balance: Web3Utils.toWei(account1EtherBalance, "ether"),
                    },
                    {
                        secretKey: eth_utils_1.EthUtils.hexStringFull(account2.privateKey),
                        balance: Web3Utils.toWei(account2EtherBalance, "ether"),
                    },
                ],
            }),
            privateKey: account1.privateKey,
        });
        test("Success", function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var amountEtherToSend, transactionReceipt, newAccount1Balance, newAccount2Balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountEtherToSend = "1";
                        return [4 /*yield*/, web3Helper.sendTransactionToExternalAccount({
                                to: account2.address,
                                value: Web3Utils.toWei(amountEtherToSend, "ether"),
                            })];
                    case 1:
                        transactionReceipt = (_a.sent());
                        expect(transactionReceipt.blockHash).toBeDefined();
                        expect(transactionReceipt.from).toEqual(account1.address.toLowerCase());
                        expect(transactionReceipt.to).toEqual(account2.address.toLowerCase());
                        return [4 /*yield*/, web3Helper.getEtherBalance(account1.address)];
                    case 2:
                        newAccount1Balance = _a.sent();
                        return [4 /*yield*/, web3Helper.getEtherBalance(account2.address)];
                    case 3:
                        newAccount2Balance = _a.sent();
                        expect(new BN(newAccount2Balance)
                            .sub(new BN(account2EtherBalance))
                            .eq(new BN(amountEtherToSend))).toBeTruthy();
                        expect(new BN(account1EtherBalance)
                            .sub(new BN(newAccount1Balance))
                            .lt(new BN(amountEtherToSend))).toBeTruthy();
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("getTransactionsByAccount", function () {
        var account1 = eth_utils_1.EthUtils.privateKeyToAccount("bd5b039dce6728c1f1c9b8af05a368371500264aa69cd253348f4d9376b6cdb7");
        var account1EtherBalance = "100";
        var account2 = eth_utils_1.EthUtils.privateKeyToAccount("cd7db44224eb86096327e544063818c7148b892e6ddbeec29448bb7099cdc541");
        var account2EtherBalance = "100";
        var web3Helper = eth_helper_1.EthHelper.factoryMethod({
            provider: Ganache.provider({
                accounts: [
                    {
                        secretKey: eth_utils_1.EthUtils.hexStringFull(account1.privateKey),
                        balance: Web3Utils.toWei(account1EtherBalance, "ether"),
                    },
                    {
                        secretKey: eth_utils_1.EthUtils.hexStringFull(account2.privateKey),
                        balance: Web3Utils.toWei(account2EtherBalance, "ether"),
                    },
                ],
            }),
            privateKey: account1.privateKey,
        });
        test("success", function (done) { return __awaiter(void 0, void 0, void 0, function () {
            var amountEtherToSend, transactionReceipt1, transactionReceipt2, transactionReceipt3, sentFromAccount1Transactions, sentToAccoun1Transactions, relatedToAccount1Transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amountEtherToSend = "1";
                        return [4 /*yield*/, web3Helper.sendTransactionToExternalAccount({
                                to: account2.address,
                                value: Web3Utils.toWei(amountEtherToSend, "ether"),
                            })];
                    case 1:
                        transactionReceipt1 = (_a.sent());
                        return [4 /*yield*/, web3Helper.sendTransactionToExternalAccount({
                                to: account2.address,
                                value: Web3Utils.toWei(amountEtherToSend, "ether"),
                            })];
                    case 2:
                        transactionReceipt2 = (_a.sent());
                        return [4 /*yield*/, web3Helper.sendTransactionToExternalAccount({
                                to: account1.address,
                                value: Web3Utils.toWei(amountEtherToSend, "ether"),
                            }, { privateKey: account2.privateKey })];
                    case 3:
                        transactionReceipt3 = (_a.sent());
                        return [4 /*yield*/, web3Helper.getTransactionsByAccount(account1.address, {
                                startBlockNumber: 0,
                                include: "from",
                            })];
                    case 4:
                        sentFromAccount1Transactions = _a.sent();
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
                        return [4 /*yield*/, web3Helper.getTransactionsByAccount(account1.address, {
                                startBlockNumber: 0,
                                include: "to",
                            })];
                    case 5:
                        sentToAccoun1Transactions = _a.sent();
                        expect(sentToAccoun1Transactions).toEqual([
                            expect.objectContaining({
                                blockHash: transactionReceipt3.blockHash,
                                blockNumber: transactionReceipt3.blockNumber,
                                from: account2.address,
                                to: account1.address,
                                value: Web3Utils.toWei(amountEtherToSend, "ether"),
                            }),
                        ]);
                        return [4 /*yield*/, web3Helper.getTransactionsByAccount(account1.address, {
                                startBlockNumber: 0,
                                include: "both",
                            })];
                    case 6:
                        relatedToAccount1Transactions = _a.sent();
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
                        return [2 /*return*/];
                }
            });
        }); });
    });
    // Ganache hasn't support this function yet
    describe.skip("isAccountSendingTransaction", function () { });
});

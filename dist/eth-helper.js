"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.EthHelper = void 0;
var HttpProvider = require("web3-providers-http");
var Eth = require("web3-eth");
var Web3Utils = require("web3-utils");
var eth_utils_1 = require("./eth-utils");
var EthHelper = /** @class */ (function () {
    function EthHelper(provider, privateKey, options) {
        var defaultTransactionConfirmationBlocks = (options || {}).defaultTransactionConfirmationBlocks;
        this.eth = new Eth(provider);
        if (privateKey) {
            this.defaultAccount = this.eth.accounts.privateKeyToAccount(privateKey);
        }
        if (defaultTransactionConfirmationBlocks) {
            this.eth.transactionConfirmationBlocks = defaultTransactionConfirmationBlocks;
        }
        this.defaultTransactionConfirmationBlocks = this.eth.transactionConfirmationBlocks;
    }
    EthHelper.factoryMethod = function (args) {
        if (args === void 0) { args = {}; }
        var httpProviderHost = args.httpProviderHost, privateKey = args.privateKey, options = args.options;
        var provider;
        if (args.provider) {
            provider = args.provider;
        }
        if (args.httpProviderHost) {
            provider = new HttpProvider(httpProviderHost);
        }
        if (!provider) {
            throw Error("Provider is missing");
        }
        return new EthHelper(provider, privateKey, options);
    };
    /**
     * Get ETH balance
     * @param accountAddress Account Address
     * @returns eth balance
     */
    EthHelper.prototype.getEtherBalance = function (accountAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var balance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.eth.getBalance(accountAddress)];
                    case 1:
                        balance = _a.sent();
                        return [2 /*return*/, Web3Utils.fromWei(balance, "ether")];
                }
            });
        });
    };
    EthHelper.prototype.getWeiBalance = function (accountAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.eth.getBalance(accountAddress)];
            });
        });
    };
    EthHelper.prototype.generateAccount = function (privateKey) {
        return this.eth.accounts.privateKeyToAccount(privateKey);
    };
    EthHelper.prototype.resetTransactionConfirmationBlocks = function () {
        this.eth.transactionConfirmationBlocks = this.defaultTransactionConfirmationBlocks;
    };
    EthHelper.prototype.setDefaultTransactionConfirmationBlocks = function (transactionConfirmationBlocks) {
        this.defaultTransactionConfirmationBlocks = transactionConfirmationBlocks;
        this.eth.transactionConfirmationBlocks = transactionConfirmationBlocks;
    };
    EthHelper.prototype.getAccounts = function () {
        return this.eth.getAccounts();
    };
    EthHelper.prototype.setProvider = function (provider) {
        return this.eth.setProvider(provider);
    };
    EthHelper.prototype.setDefaultAccount = function (privateKey) {
        this.defaultAccount = this.eth.accounts.privateKeyToAccount(privateKey);
    };
    EthHelper.prototype.getPendingTransactions = function () {
        return this.eth.getPendingTransactions();
    };
    EthHelper.prototype.sendTransactionToExternalAccount = function (transactionConfig, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, privateKey, transactionConfirmationBlocks, onlyGetTxHash, account, signedTransaction, _b, _c, _d, _e, _f, transactionReceipt;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _a = options || {}, privateKey = _a.privateKey, transactionConfirmationBlocks = _a.transactionConfirmationBlocks, onlyGetTxHash = _a.onlyGetTxHash;
                        account = privateKey
                            ? this.generateAccount(privateKey)
                            : this.defaultAccount;
                        if (!account) {
                            throw Error("Private key or default account is missing");
                        }
                        _c = (_b = this.eth.accounts).signTransaction;
                        _d = [__assign({}, transactionConfig)];
                        _e = { from: account.address };
                        _f = transactionConfig.gas;
                        if (_f) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.estimateGas(transactionConfig)];
                    case 1:
                        _f = (_g.sent());
                        _g.label = 2;
                    case 2: return [4 /*yield*/, _c.apply(_b, [__assign.apply(void 0, _d.concat([(_e.gas = _f, _e)])), eth_utils_1.EthUtils.hexStringFull(account.privateKey)])];
                    case 3:
                        signedTransaction = _g.sent();
                        if (!signedTransaction.rawTransaction ||
                            !signedTransaction.transactionHash) {
                            throw Error("Send transaction fail");
                        }
                        if (onlyGetTxHash) {
                            return [2 /*return*/, signedTransaction.transactionHash];
                        }
                        if (transactionConfirmationBlocks) {
                            this.eth.transactionConfirmationBlocks = transactionConfirmationBlocks;
                        }
                        return [4 /*yield*/, this.eth.sendSignedTransaction(signedTransaction.rawTransaction)];
                    case 4:
                        transactionReceipt = _g.sent();
                        this.resetTransactionConfirmationBlocks();
                        return [2 /*return*/, transactionReceipt];
                }
            });
        });
    };
    EthHelper.prototype.getTransactionsByAccount = function (accountAddress, options) {
        return __awaiter(this, void 0, void 0, function () {
            var startBlockNumber, _a, endBlockNumber, include, _b, transactions, i, block;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        startBlockNumber = options.startBlockNumber, _a = options.endBlockNumber;
                        if (!(_a === void 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.eth.getBlockNumber()];
                    case 1:
                        _b = _c.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _b = _a;
                        _c.label = 3;
                    case 3:
                        endBlockNumber = _b, include = options.include;
                        transactions = [];
                        i = startBlockNumber;
                        _c.label = 4;
                    case 4:
                        if (!(i <= endBlockNumber)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.eth.getBlock(i, true)];
                    case 5:
                        block = _c.sent();
                        transactions.push.apply(transactions, block.transactions.filter(function (tx) {
                            return include === "from"
                                ? tx.from === accountAddress
                                : include === "to"
                                    ? tx.to === accountAddress
                                    : tx.to === accountAddress || tx.from === accountAddress;
                        }));
                        _c.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, transactions];
                }
            });
        });
    };
    EthHelper.prototype.isAccountSendingTransaction = function (accountAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPendingTransactions()];
                    case 1:
                        transactions = _a.sent();
                        return [2 /*return*/, Boolean(transactions.find(function (tx) { return tx.from === accountAddress; }))];
                }
            });
        });
    };
    return EthHelper;
}());
exports.EthHelper = EthHelper;

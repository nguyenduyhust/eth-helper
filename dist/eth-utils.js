"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthUtils = void 0;
var Accounts = require("web3-eth-accounts");
var EthUtils = /** @class */ (function () {
    function EthUtils() {
    }
    EthUtils.hexStringFull = function (value) {
        return !value || typeof value !== "string" || value.match(/^0x/)
            ? value
            : "0x" + value;
    };
    EthUtils.hexStringShort = function (value) {
        return value && typeof value === "string" && value.match(/^0x/)
            ? value.substr(2)
            : value;
    };
    EthUtils.padLeft = function (value, length, fill) {
        if (typeof value !== "string") {
            return "";
        }
        return value.padStart(length, fill);
    };
    EthUtils.privateKeyToAccount = function (privateKey) {
        var accounts = new Accounts("");
        return accounts.privateKeyToAccount(EthUtils.hexStringFull(privateKey));
    };
    EthUtils.createAccount = function () {
        var accounts = new Accounts("");
        return accounts.create();
    };
    return EthUtils;
}());
exports.EthUtils = EthUtils;

"use strict";
exports.__esModule = true;
exports.createTransactionForNetwork = exports.createTransactionBuilderFromTransaction = exports.createTransactionBuilderForNetwork = exports.createTransactionFromHex = exports.createTransactionFromBuffer = void 0;
/**
 * @prettier
 */
var networks = require("../networks");
var coins_1 = require("../coins");
var Transaction = require('../transaction');
var TransactionBuilder = require('../transaction_builder');
function createTransactionFromBuffer(buf, network) {
    switch (coins_1.getMainnet(network)) {
        case networks.bitcoin:
        case networks.bitcoincash:
        case networks.bitcoinsv:
        case networks.bitcoingold:
        case networks.dash:
        case networks.litecoin:
        case networks.zcash:
            return Transaction.fromBuffer(buf, network);
    }
    /* istanbul ignore next */
    throw new Error("invalid network");
}
exports.createTransactionFromBuffer = createTransactionFromBuffer;
function createTransactionFromHex(hex, network) {
    return createTransactionFromBuffer(Buffer.from(hex, 'hex'), network);
}
exports.createTransactionFromHex = createTransactionFromHex;
function createTransactionBuilderForNetwork(network) {
    switch (coins_1.getMainnet(network)) {
        case networks.bitcoin:
        case networks.bitcoincash:
        case networks.bitcoinsv:
        case networks.bitcoingold:
        case networks.dash:
        case networks.litecoin: {
            var txb = new TransactionBuilder(network);
            switch (coins_1.getMainnet(network)) {
                case networks.bitcoincash:
                case networks.bitcoinsv:
                    txb.setVersion(2);
            }
            return txb;
        }
        case networks.zcash: {
            var txb = new TransactionBuilder(network);
            txb.setVersion(4);
            txb.setVersionGroupId(0x892f2085);
            // Use "Canopy" consensus branch ID https://zips.z.cash/zip-0251
            txb.setConsensusBranchId(0xc2d6d0b4);
            return txb;
        }
    }
    /* istanbul ignore next */
    throw new Error("invalid network");
}
exports.createTransactionBuilderForNetwork = createTransactionBuilderForNetwork;
function createTransactionBuilderFromTransaction(tx) {
    switch (coins_1.getMainnet(tx.network)) {
        case networks.bitcoin:
        case networks.bitcoincash:
        case networks.bitcoinsv:
        case networks.bitcoingold:
        case networks.dash:
        case networks.litecoin:
        case networks.zcash:
            return TransactionBuilder.fromTransaction(tx, tx.network);
    }
    /* istanbul ignore next */
    throw new Error("invalid network");
}
exports.createTransactionBuilderFromTransaction = createTransactionBuilderFromTransaction;
function createTransactionForNetwork(network) {
    switch (coins_1.getMainnet(network)) {
        case networks.bitcoin:
        case networks.bitcoincash:
        case networks.bitcoinsv:
        case networks.bitcoingold:
        case networks.dash:
        case networks.litecoin:
        case networks.zcash:
            return new Transaction(network);
    }
    /* istanbul ignore next */
    throw new Error("invalid network");
}
exports.createTransactionForNetwork = createTransactionForNetwork;

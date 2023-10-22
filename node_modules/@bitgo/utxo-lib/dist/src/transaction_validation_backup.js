"use strict";
exports.__esModule = true;
exports.validateFundedTransaction = void 0;
var verus_typescript_primitives_1 = require("verus-typescript-primitives");
var bn_js_1 = require("bn.js");
var Transaction = require('./transaction.js');
var script = require('./script.js');
var opcodes = require('bitcoin-ops');
var evals = require('bitcoin-ops/evals.json');
var OptCCParams = require('./optccparams');
var templates = require('./templates');
// Hack to force BigNumber to get typeof class instead of BN namespace
var BNClass = new bn_js_1.BN(0);
var validateFundedTransaction = function (systemId, fundedTxHex, unfundedTxHex, changeAddr, network, utxoList) {
    var _a, _b, _c;
    var amountsIn = (_a = {}, _a[systemId] = new bn_js_1.BN(0), _a);
    var amountsOut = (_b = {}, _b[systemId] = new bn_js_1.BN(0), _b);
    var amountChange = (_c = {}, _c[systemId] = new bn_js_1.BN(0), _c);
    var fundedTx = Transaction.fromHex(fundedTxHex, network);
    var unfundedTx = Transaction.fromHex(unfundedTxHex, network);
    var fundedTxComparison = Transaction.fromHex(fundedTxHex, network);
    fundedTxComparison.ins = [];
    fundedTx.outs = fundedTx.outs;
    unfundedTx.outs = unfundedTx.outs;
    fundedTxComparison.outs = fundedTxComparison.outs;
    fundedTx.ins = fundedTx.ins;
    unfundedTx.ins = unfundedTx.ins;
    fundedTxComparison.ins = fundedTxComparison.ins;
    var changeOutput;
    if (!fundedTxComparison.outs.length) {
        return {
            valid: false,
            message: "Transaction has " + fundedTxComparison.outs.length + " outputs."
        };
    }
    // Verify outputs are the same except for one change output added at end
    for (var i = 0, j = 0; i < fundedTxComparison.outs.length; i++, j++) {
        var out = fundedTxComparison.outs[i];
        var outScript = out.script.toString('hex');
        if (unfundedTx.outs[j] != null &&
            outScript === unfundedTx.outs[j].script.toString('hex') &&
            out.value === unfundedTx.outs[j].value) {
            continue;
        }
        else if (!changeOutput) {
            changeOutput = out;
            j--;
        }
        else {
            return {
                valid: false,
                message: "Transaction has " + fundedTxComparison.outs.length + " outputs, expected less."
            };
        }
    }
    if (changeOutput != null) {
        fundedTxComparison.outs.shift();
    }
    // Verify funded tx and unfunded tx are the same where 
    // they should be the same
    if (fundedTxComparison.toHex() !== unfundedTx.toHex()) {
        return {
            valid: false,
            message: "Transaction hex does not match unfunded component."
        };
    }
    var _loop_1 = function (input) {
        var inputHash = Buffer.from(input.hash).reverse().toString('hex');
        var inputUtxoIndex = utxoList.findIndex(function (x) { return ((x.txid === inputHash) && x.outputIndex === input.index); });
        if (inputUtxoIndex < 0) {
            return { value: {
                    valid: false,
                    message: "Cannot find corresponding input for " + inputHash + " index " + input.index + "."
                } };
        }
        var inputUtxo = utxoList[inputUtxoIndex];
        var _script = script.decompile(Buffer.from(inputUtxo.script, 'hex'));
        if (_script.length === 4 && _script[1] === opcodes.OP_CHECKCRYPTOCONDITION && _script[3] === opcodes.OP_DROP) {
            try {
                var master = OptCCParams.fromChunk(_script[0]);
                var params = OptCCParams.fromChunk(_script[2]);
                if (!master.isValid() || master.evalCode !== 0)
                    return { value: {
                            valid: false,
                            message: "Invalid master OptCCParam for input " + inputHash + " index " + input.index
                        } };
                if (!(master.m === 1 && master.n === 1) && !(master.m === 0 && master.n === 0))
                    return { value: {
                            valid: false,
                            message: "Multisig master not supported for input " + inputHash + " index " + input.index
                        } };
                if (!(params.m === 1 && params.n === 1))
                    return { value: {
                            valid: false,
                            message: "Multisig params not supported for input " + inputHash + " index " + input.index
                        } };
                if (!params.isValid())
                    return { value: {
                            valid: false,
                            message: "Invalid param OptCCParam for input " + inputHash + " index " + input.index
                        } };
                switch (params.evalCode) {
                    case evals.EVAL_NONE:
                        if (params.vData.length !== 0)
                            return { value: {
                                    valid: false,
                                    message: "Unexpected length of vdata array for input " + inputHash + " index " + input.index
                                } };
                        amountsIn[systemId] = amountsIn[systemId].add(new bn_js_1.BN(inputUtxo.satoshis));
                        break;
                    case evals.EVAL_RESERVE_TRANSFER:
                        if (params.vData.length !== 1)
                            return { value: {
                                    valid: false,
                                    message: "Unexpected length of vdata array for input " + inputHash + " index " + input.index
                                } };
                        var resTransfer = new verus_typescript_primitives_1.ReserveTransfer();
                        resTransfer.fromBuffer(params.vData[0]);
                        amountsIn[systemId] = amountsIn[systemId].add(new bn_js_1.BN(inputUtxo.satoshis));
                        resTransfer.reserve_values.value_map.forEach(function (value, key) {
                            if (!amountsIn[key])
                                amountsIn[key] = value;
                            else
                                amountsIn[key] = amountsIn[key].add(amountsIn[key]);
                        });
                        break;
                    case evals.EVAL_RESERVE_OUTPUT:
                        if (params.vData.length !== 1)
                            return { value: {
                                    valid: false,
                                    message: "Unexpected length of vdata array for input " + inputHash + " index " + input.index
                                } };
                        var resOutput = new verus_typescript_primitives_1.TokenOutput();
                        resOutput.fromBuffer(params.vData[0]);
                        amountsIn[systemId] = amountsIn[systemId].add(new bn_js_1.BN(inputUtxo.satoshis));
                        resOutput.reserve_values.value_map.forEach(function (value, key) {
                            if (!amountsIn[key])
                                amountsIn[key] = value;
                            else
                                amountsIn[key] = amountsIn[key].add(amountsIn[key]);
                        });
                        break;
                    default: return { value: {
                            valid: false,
                            message: "Unsupported eval code " + params.evalCode + " for input " + inputHash + " index " + input.index
                        } };
                }
            }
            catch (e) {
                return { value: {
                        valid: false,
                        message: "Failed to parse smart transaction utxo: " + e.message
                    } };
            }
        }
        else {
            var sigType = templates.classifyInput(_script, true);
            if (sigType === templates.types.P2PKH) {
                amountsIn[systemId] = amountsIn[systemId].add(new bn_js_1.BN(inputUtxo.satoshis));
            }
            else {
                return { value: {
                        valid: false,
                        message: "Invalid input tx type " + sigType
                    } };
            }
        }
    };
    // Verify all inputs are correct and count their amounts
    for (var _i = 0, _d = fundedTx.ins; _i < _d.length; _i++) {
        var input = _d[_i];
        var state_1 = _loop_1(input);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    // Count output amounts (trusted more than input because we verify that they match
    // the outputs submitted in the unfunded transaction)
    for (var i = 0; i < unfundedTx.outs.length; i++) {
        var output = unfundedTx.outs[i];
        var _script = script.decompile(Buffer.from(output.script, 'hex'));
        if (_script.length === 4 && _script[1] === opcodes.OP_CHECKCRYPTOCONDITION && _script[3] === opcodes.OP_DROP) {
            try {
                var params = OptCCParams.fromChunk(_script[2]);
                switch (params.evalCode) {
                    case evals.EVAL_NONE:
                        if (params.vData.length !== 0)
                            return {
                                valid: false,
                                message: "Unexpected length of vdata array for output " + i
                            };
                        amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(output.value));
                        break;
                    case evals.EVAL_RESERVE_TRANSFER:
                        if (params.vData.length !== 1)
                            return {
                                valid: false,
                                message: "Unexpected length of vdata array for output " + i
                            };
                        var resTransfer = new verus_typescript_primitives_1.ReserveTransfer();
                        resTransfer.fromBuffer(params.vData[0]);
                        amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(output.value));
                        resTransfer.reserve_values.value_map.forEach(function (value, key) {
                            if (!amountsOut[key])
                                amountsOut[key] = value;
                            else
                                amountsOut[key] = amountsOut[key].add(amountsOut[key]);
                        });
                        break;
                    case evals.EVAL_RESERVE_OUTPUT:
                        if (params.vData.length !== 1)
                            return {
                                valid: false,
                                message: "Unexpected length of vdata array for output " + i
                            };
                        var resOutput = new verus_typescript_primitives_1.TokenOutput();
                        resOutput.fromBuffer(params.vData[0]);
                        amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(output.value));
                        resOutput.reserve_values.value_map.forEach(function (value, key) {
                            if (!amountsOut[key])
                                amountsOut[key] = value;
                            else
                                amountsOut[key] = amountsOut[key].add(amountsOut[key]);
                        });
                        break;
                    default:
                        return {
                            valid: false,
                            message: "Unsupported eval code " + params.evalCode + " for output " + i
                        };
                }
            }
            catch (e) {
                return {
                    valid: false,
                    message: "Failed to parse smart transaction output: " + e.message
                };
            }
        }
        else {
            amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(output.value));
        }
    }
    if (changeOutput != null) {
        // Verify change output
        var outputType = templates.classifyOutput(changeOutput.script);
        if (outputType === templates.types.P2PKH) {
            var destAddr = verus_typescript_primitives_1.toBase58Check(templates.pubKeyHash.output.decode(changeOutput.script), 60);
            if (changeAddr !== destAddr)
                return {
                    valid: false,
                    message: "Provided change address " + destAddr + " does not match expected change address " + changeAddr + "."
                };
            amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(changeOutput.value));
            amountChange[systemId] = amountChange[systemId].add(new bn_js_1.BN(changeOutput.value));
        }
        else if (outputType === templates.types.SMART_TRANSACTION) {
            var _script = script.decompile(changeOutput.script);
            var master = OptCCParams.fromChunk(_script[0]);
            var params = OptCCParams.fromChunk(_script[2]);
            if (!master.isValid() || master.evalCode !== 0)
                return {
                    valid: false,
                    message: "Invalid master OptCCParam for change"
                };
            if (!(master.m === 1 && master.n === 1))
                return {
                    valid: false,
                    message: "Multisig master not supported for change"
                };
            if (!(params.m === 1 && params.n === 1))
                return {
                    valid: false,
                    message: "Multisig params not supported for change"
                };
            if (!params.isValid())
                return {
                    valid: false,
                    message: "Invalid param OptCCParam for change"
                };
            var destinations = master.destinations;
            if (destinations.length !== 1)
                return {
                    valid: false,
                    message: "Only one change destination supported"
                };
            var destination = destinations[0];
            if (destination.destType !== 2 && destination.destType !== 4)
                return {
                    valid: false,
                    message: "Unsupported change destination type"
                };
            var destAddr = verus_typescript_primitives_1.toBase58Check(destination.destinationBytes, destination.destType === 2 ? 60 : 102);
            if (changeAddr !== destAddr)
                return {
                    valid: false,
                    message: "Provided change address " + destAddr + " does not match expected change address " + changeAddr + "."
                };
            switch (params.evalCode) {
                case evals.EVAL_NONE:
                    if (params.vData.length !== 0)
                        return {
                            valid: false,
                            message: "Unexpected length of vdata array for change"
                        };
                    amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(changeOutput.value));
                    amountChange[systemId] = amountChange[systemId].add(new bn_js_1.BN(changeOutput.value));
                    break;
                case evals.EVAL_RESERVE_OUTPUT:
                    if (params.vData.length !== 1)
                        return {
                            valid: false,
                            message: "Unexpected length of vdata array for change"
                        };
                    var resOutput = new verus_typescript_primitives_1.TokenOutput();
                    resOutput.fromBuffer(params.vData[0]);
                    amountsOut[systemId] = amountsOut[systemId].add(new bn_js_1.BN(changeOutput.value));
                    amountChange[systemId] = amountChange[systemId].add(new bn_js_1.BN(changeOutput.value));
                    resOutput.reserve_values.value_map.forEach(function (value, key) {
                        if (!amountsOut[key])
                            amountsOut[key] = value;
                        else
                            amountsOut[key] = amountsOut[key].add(amountsOut[key]);
                        if (!amountChange[key])
                            amountChange[key] = value;
                        else
                            amountChange[key] = amountChange[key].add(amountChange[key]);
                    });
                    break;
                default:
                    return {
                        valid: false,
                        message: "Unsupported eval code " + params.evalCode + " for change"
                    };
            }
        }
    }
    var _in = {};
    var _out = {};
    var _change = {};
    var _fees = {};
    var _sent = {};
    for (var key in amountsIn) {
        _in[key] = amountsIn[key].toString();
    }
    for (var key in amountsOut) {
        _out[key] = amountsOut[key].toString();
    }
    for (var key in amountChange) {
        _change[key] = amountChange[key].toString();
    }
    for (var key in amountsIn) {
        var outVal = amountsOut[key] != null ? amountsOut[key] : new bn_js_1.BN(0);
        _fees[key] = (amountsIn[key].sub(outVal)).toString();
    }
    for (var key in amountsIn) {
        var changeVal = amountChange[key] != null ? amountChange[key] : new bn_js_1.BN(0);
        var feeVal = _fees[key] ? new bn_js_1.BN(_fees[key]) : new bn_js_1.BN(0);
        _sent[key] = (amountsIn[key].sub(changeVal).sub(feeVal)).toString();
    }
    return { valid: true, "in": _in, out: _out, change: _change, fees: _fees, sent: _sent };
};
exports.validateFundedTransaction = validateFundedTransaction;

"use strict";
exports.__esModule = true;
exports.validateFundedTransaction = exports.unpackOutput = void 0;
var verus_typescript_primitives_1 = require("verus-typescript-primitives");
var bn_js_1 = require("bn.js");
var Transaction = require('./transaction.js');
var script = require('./script.js');
var evals = require('bitcoin-ops/evals.json');
var OptCCParams = require('./optccparams');
var templates = require('./templates');
// Hack to force BigNumber to get typeof class instead of BN namespace
var BNClass = new bn_js_1.BN(0);
var unpackOutput = function (output, systemId) {
    var _a;
    // Verify change output
    var outputScript = output.script;
    var outputType = templates.classifyOutput(outputScript);
    var values = (_a = {}, _a[systemId] = new bn_js_1.BN(0), _a);
    var destinations = [];
    var master;
    var params = [];
    if (outputType === templates.types.P2PKH) {
        var destAddr = verus_typescript_primitives_1.toBase58Check(templates.pubKeyHash.output.decode(outputScript), 60);
        values[systemId] = values[systemId].add(new bn_js_1.BN(output.value));
        destinations.push(destAddr);
    }
    else if (outputType === templates.types.SMART_TRANSACTION) {
        var masterOptCC = void 0;
        var paramsOptCC = [];
        var decompiledScript = script.decompile(outputScript);
        for (var i = 0; i < decompiledScript.length; i += 2) {
            if (i === 0)
                masterOptCC = OptCCParams.fromChunk(decompiledScript[i]);
            else
                paramsOptCC.push(OptCCParams.fromChunk(decompiledScript[i]));
        }
        if (paramsOptCC.length > 1)
            throw new Error(">1 OptCCParam objects not currently supported for smart transaction params.");
        var processDestination = function (destination) {
            if (destination.destType !== 2 && destination.destType !== 4) {
                throw new Error("Unsupported change destination type");
            }
            var destAddr = verus_typescript_primitives_1.toBase58Check(destination.destinationBytes, destination.destType === 2 ? 60 : 102);
            if (!destinations.includes(destAddr)) {
                destinations.push(destAddr);
            }
        };
        var processOptCCParam = function (ccparam) {
            var _a;
            var data;
            var ccvalues = (_a = {}, _a[systemId] = new bn_js_1.BN(0), _a);
            switch (ccparam.evalCode) {
                case evals.EVAL_NONE:
                    if (ccparam.vData.length !== 0) {
                        throw new Error("Unexpected length of vdata array for eval code " + ccparam.evalCode);
                    }
                    ccvalues[systemId] = ccvalues[systemId].add(new bn_js_1.BN(output.value));
                    break;
                case evals.EVAL_RESERVE_TRANSFER:
                    if (ccparam.vData.length !== 1) {
                        throw new Error("Unexpected length of vdata array for eval code " + ccparam.evalCode);
                    }
                    var resTransfer = new verus_typescript_primitives_1.ReserveTransfer();
                    resTransfer.fromBuffer(ccparam.vData[0]);
                    ccvalues[systemId] = ccvalues[systemId].add(new bn_js_1.BN(output.value));
                    resTransfer.reserve_values.value_map.forEach(function (value, key) {
                        if (!ccvalues[key])
                            ccvalues[key] = value;
                        else
                            ccvalues[key] = ccvalues[key].add(value);
                    });
                    data = resTransfer;
                    break;
                case evals.EVAL_RESERVE_OUTPUT:
                    if (ccparam.vData.length !== 1) {
                        throw new Error("Unexpected length of vdata array for eval code " + ccparam.evalCode);
                    }
                    var resOutput = new verus_typescript_primitives_1.TokenOutput();
                    resOutput.fromBuffer(ccparam.vData[0]);
                    ccvalues[systemId] = ccvalues[systemId].add(new bn_js_1.BN(output.value));
                    resOutput.reserve_values.value_map.forEach(function (value, key) {
                        if (!ccvalues[key])
                            ccvalues[key] = value;
                        else
                            ccvalues[key] = ccvalues[key].add(value);
                    });
                    data = resOutput;
                    break;
                default:
                    throw new Error("Unsupported eval code " + ccparam.evalCode);
            }
            return {
                version: ccparam.version,
                eval: ccparam.evalCode,
                m: ccparam.m,
                n: ccparam.n,
                data: data,
                values: ccvalues
            };
        };
        master = processOptCCParam(masterOptCC);
        for (var _i = 0, _b = masterOptCC.destinations; _i < _b.length; _i++) {
            var destination = _b[_i];
            processDestination(destination);
        }
        for (var _c = 0, paramsOptCC_1 = paramsOptCC; _c < paramsOptCC_1.length; _c++) {
            var paramsCc = paramsOptCC_1[_c];
            var processedParams = processOptCCParam(paramsCc);
            params.push(processedParams);
            for (var key in processedParams.values) {
                var value = processedParams.values[key];
                if (!values[key])
                    values[key] = value;
                else
                    values[key] = values[key].add(value);
            }
            for (var _d = 0, _e = paramsCc.destinations; _d < _e.length; _d++) {
                var destination = _e[_d];
                processDestination(destination);
            }
        }
    }
    else {
        throw new Error("Unsupported output type " + outputType);
    }
    return {
        destinations: destinations,
        values: values,
        type: outputType,
        master: master,
        params: params.length > 0 ? params : undefined
    };
};
exports.unpackOutput = unpackOutput;
var validateFundedTransaction = function (systemId, fundedTxHex, unfundedTxHex, changeAddr, network, utxoList) {
    var _a, _b, _c;
    var amountsIn = (_a = {}, _a[systemId] = new bn_js_1.BN(0), _a);
    var amountsOut = (_b = {}, _b[systemId] = new bn_js_1.BN(0), _b);
    var amountChange = (_c = {}, _c[systemId] = new bn_js_1.BN(0), _c);
    var fundedTx = Transaction.fromHex(fundedTxHex, network);
    var unfundedTx = Transaction.fromHex(unfundedTxHex, network);
    var fundedTxComparison = Transaction.fromHex(fundedTxHex, network);
    if (!fundedTxComparison.ins.length) {
        return {
            valid: false,
            message: "Transaction has " + fundedTxComparison.ins.length + " inputs."
        };
    }
    fundedTxComparison.ins = [];
    fundedTx.outs = fundedTx.outs;
    unfundedTx.outs = unfundedTx.outs;
    fundedTxComparison.outs = fundedTxComparison.outs;
    fundedTx.ins = fundedTx.ins;
    unfundedTx.ins = unfundedTx.ins;
    fundedTxComparison.ins = fundedTxComparison.ins;
    var changeOutputs = [];
    var changeIndices = [];
    if (!fundedTxComparison.outs.length) {
        return {
            valid: false,
            message: "Transaction has " + fundedTxComparison.outs.length + " outputs."
        };
    }
    // Find all change outputs
    for (var i = 0, j = 0; i < fundedTxComparison.outs.length; i++, j++) {
        var out = fundedTxComparison.outs[i];
        var outScript = out.script.toString('hex');
        if (unfundedTx.outs[j] != null &&
            outScript === unfundedTx.outs[j].script.toString('hex') &&
            out.value === unfundedTx.outs[j].value) {
            continue;
        }
        else {
            changeOutputs.push(out);
            changeIndices.push(i);
            j--;
        }
    }
    // Filter change outputs from tx comparison
    fundedTxComparison.outs = fundedTxComparison.outs.filter(function (x, i) {
        return !changeIndices.includes(i);
    });
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
        var _script = Buffer.from(inputUtxo.script, 'hex');
        var _value = inputUtxo.satoshis;
        try {
            var inputInfo = exports.unpackOutput({ value: _value, script: _script }, systemId);
            for (var key in inputInfo.values) {
                if (amountsIn[key] == null) {
                    amountsIn[key] = new bn_js_1.BN(inputInfo.values[key] != null ? inputInfo.values[key] : 0);
                }
                else
                    amountsIn[key] = amountsIn[key].add(inputInfo.values[key]);
            }
        }
        catch (e) {
            return { value: {
                    valid: false,
                    message: e.message
                } };
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
        try {
            var outputInfo = exports.unpackOutput(output, systemId);
            for (var key in outputInfo.values) {
                if (amountsOut[key] == null) {
                    amountsOut[key] = new bn_js_1.BN(outputInfo.values[key] != null ? outputInfo.values[key] : 0);
                }
                else
                    amountsOut[key] = amountsOut[key].add(outputInfo.values[key]);
            }
        }
        catch (e) {
            return {
                valid: false,
                message: e.message
            };
        }
    }
    // Ensure change amounts go to correct destination
    for (var i = 0; i < changeOutputs.length; i++) {
        var output = changeOutputs[i];
        try {
            var outputInfo = exports.unpackOutput(output, systemId);
            if (outputInfo.type !== templates.types.P2PKH && outputInfo.type !== templates.types.SMART_TRANSACTION) {
                throw new Error("Cannot use non p2pkh/smarttx utxo type as change.");
            }
            if (outputInfo.destinations.filter(function (x) { return x !== changeAddr; }).length !== 0) {
                throw new Error("Some change destinations are not " + changeAddr + ".");
            }
            if (outputInfo.type === templates.types.SMART_TRANSACTION) {
                if (outputInfo.params.length !== 1)
                    throw new Error("Invalid param length for change smarttx");
                var master = outputInfo.master;
                var param = outputInfo.params[0];
                if (master.eval !== evals.EVAL_NONE) {
                    throw new Error("Change smartx master must be EVAL_NONE");
                }
                if (!(master.m === 1 && master.n === 1 && param.m === 1 && param.n === 1)) {
                    throw new Error("Multisig change unsupported");
                }
                switch (param.eval) {
                    case evals.EVAL_NONE:
                    case evals.EVAL_RESERVE_OUTPUT:
                        break;
                    default:
                        throw new Error("Change only supports EVAL_NONE and EVAL_RESERVE_OUTPUT smarttxs");
                }
            }
            for (var key in outputInfo.values) {
                if (amountsOut[key] == null)
                    amountsOut[key] = new bn_js_1.BN(outputInfo.values[key] != null ? outputInfo.values[key] : 0);
                else
                    amountsOut[key] = amountsOut[key].add(outputInfo.values[key]);
                if (amountChange[key] == null)
                    amountChange[key] = new bn_js_1.BN(outputInfo.values[key] != null ? outputInfo.values[key] : 0);
                else
                    amountChange[key] = amountChange[key].add(outputInfo.values[key]);
            }
        }
        catch (e) {
            return {
                valid: false,
                message: e.message
            };
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

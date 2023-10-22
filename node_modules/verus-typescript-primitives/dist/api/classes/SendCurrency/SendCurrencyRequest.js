"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendCurrencyRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class SendCurrencyRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, fromaddress, outputs, minconf, feeamount, returntxtemplate) {
        super(chain, cmds_1.SEND_CURRENCY);
        this.fromaddress = fromaddress;
        this.outputs = outputs;
        this.minconf = minconf;
        this.feeamount = feeamount;
        this.returntxtemplate = returntxtemplate;
    }
    getParams() {
        const params = [
            this.fromaddress,
            this.outputs,
            this.minconf,
            this.feeamount,
            this.returntxtemplate
        ];
        if (this.returntxtemplate)
            return params;
        else
            return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new SendCurrencyRequest(object.chain, object.fromaddress, object.outputs != null ? object.utxos : undefined, object.minconf != null ? object.minconf : undefined, object.feeamount != null ? object.feeamount : undefined, object.returntxtemplate != null ? object.returntxtemplate : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            fromaddress: this.fromaddress,
            outputs: this.outputs,
            minconf: this.minconf,
            feeamount: this.feeamount,
            returntxtemplate: this.returntxtemplate,
        };
    }
}
exports.SendCurrencyRequest = SendCurrencyRequest;

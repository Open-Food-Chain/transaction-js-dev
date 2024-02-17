"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRawTransactionRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetRawTransactionRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, txid, verbose) {
        super(chain, cmds_1.GET_RAW_TRANSACTION);
        this.txid = txid;
        this.verbose = verbose;
    }
    getParams() {
        const params = [this.txid, this.verbose];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new GetRawTransactionRequest(object.chain, object.txid, object.verbose != null ? object.verbose : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            txid: this.txid,
            verbosity: this.verbose,
        };
    }
}
exports.GetRawTransactionRequest = GetRawTransactionRequest;

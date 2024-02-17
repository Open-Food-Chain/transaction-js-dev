"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRawTransactionRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class FundRawTransactionRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, txhex, utxos, changeaddr, explicitfee) {
        super(chain, cmds_1.FUND_RAW_TRANSACTION);
        this.txhex = txhex;
        this.utxos = utxos;
        this.changeaddr = changeaddr;
        this.explicitfee = explicitfee;
    }
    getParams() {
        const params = [
            this.txhex,
            this.utxos,
            this.changeaddr,
            this.explicitfee
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new FundRawTransactionRequest(object.chain, object.txhex, object.utxos != null ? object.utxos : undefined, object.changeaddr != null ? object.changeaddr : undefined, object.explicitfee != null ? object.explicitfee : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            txhex: this.txhex,
            utxos: this.utxos,
            changeaddr: this.changeaddr,
            explicitfee: this.explicitfee,
        };
    }
}
exports.FundRawTransactionRequest = FundRawTransactionRequest;

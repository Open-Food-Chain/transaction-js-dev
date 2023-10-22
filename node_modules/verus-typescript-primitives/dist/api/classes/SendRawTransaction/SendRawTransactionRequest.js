"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendRawTransactionRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class SendRawTransactionRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, hexstring, allowhighfees) {
        super(chain, cmds_1.SEND_RAW_TRANSACTION);
        this.hexstring = hexstring;
        this.allowhighfees = allowhighfees;
    }
    getParams() {
        const params = [
            this.hexstring,
            this.allowhighfees
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new SendRawTransactionRequest(object.chain, object.hexstring, object.allowhighfees != null ? object.allowhighfees : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            hexstring: this.hexstring,
            allowhighfees: this.allowhighfees
        };
    }
}
exports.SendRawTransactionRequest = SendRawTransactionRequest;

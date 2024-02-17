"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyMessageRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class VerifyMessageRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, tAddrOrIdentity, signature, message, checklatest) {
        super(chain, cmds_1.VERIFY_MESSAGE);
        this.tAddrOrIdentity = tAddrOrIdentity;
        this.message = message;
        this.signature = signature;
        this.checklatest = checklatest;
    }
    getParams() {
        const params = [this.tAddrOrIdentity, this.signature, this.message, this.checklatest];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new VerifyMessageRequest(object.chain, object.tAddrOrIdentity, object.signature, object.message, object.checklatest != null ? object.checklatest : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            tAddrOrIdentity: this.tAddrOrIdentity,
            signature: this.signature,
            message: this.message,
            checklatest: this.checklatest,
        };
    }
}
exports.VerifyMessageRequest = VerifyMessageRequest;

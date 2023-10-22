"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignMessageRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class SignMessageRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, tAddrOrIdentity, message, cursig) {
        super(chain, cmds_1.SIGN_MESSAGE);
        this.tAddrOrIdentity = tAddrOrIdentity;
        this.message = message;
        this.cursig = cursig;
    }
    getParams() {
        const params = [this.tAddrOrIdentity, this.message, this.cursig];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new SignMessageRequest(object.chain, object.tAddrOrIdentity, object.message, object.cursig != null ? object.cursig : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            tAddrOrIdentity: this.tAddrOrIdentity,
            message: this.message,
            cursig: this.cursig
        };
    }
}
exports.SignMessageRequest = SignMessageRequest;

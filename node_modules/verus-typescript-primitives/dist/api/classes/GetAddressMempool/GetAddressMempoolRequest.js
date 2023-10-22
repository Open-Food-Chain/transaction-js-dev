"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAddressMempoolRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetAddressMempoolRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, addresses) {
        super(chain, cmds_1.GET_ADDRESS_MEMPOOL);
        this.addresses = addresses;
    }
    getParams() {
        return [
            this.addresses,
        ];
    }
    static fromJson(object) {
        return new GetAddressMempoolRequest(object.chain, object.addresses);
    }
    toJson() {
        return {
            chain: this.chain,
            addresses: this.addresses,
        };
    }
}
exports.GetAddressMempoolRequest = GetAddressMempoolRequest;

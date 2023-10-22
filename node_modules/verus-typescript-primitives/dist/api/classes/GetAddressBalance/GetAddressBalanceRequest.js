"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAddressBalanceRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetAddressBalanceRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, addresses) {
        super(chain, cmds_1.GET_ADDRESS_BALANCE);
        this.addresses = addresses;
    }
    getParams() {
        return [this.addresses];
    }
    static fromJson(object) {
        return new GetAddressBalanceRequest(object.chain, object.addresses);
    }
    toJson() {
        return {
            chain: this.chain,
            addresses: this.addresses,
        };
    }
}
exports.GetAddressBalanceRequest = GetAddressBalanceRequest;

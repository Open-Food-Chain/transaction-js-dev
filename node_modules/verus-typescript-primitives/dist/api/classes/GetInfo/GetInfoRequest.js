"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetInfoRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetInfoRequest extends ApiRequest_1.ApiRequest {
    constructor(chain) {
        super(chain, cmds_1.GET_INFO);
    }
    getParams() {
        return [];
    }
    static fromJson(object) {
        return new GetInfoRequest(object.chain);
    }
    toJson() {
        return {
            chain: this.chain,
        };
    }
}
exports.GetInfoRequest = GetInfoRequest;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlockCountRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetBlockCountRequest extends ApiRequest_1.ApiRequest {
    constructor(chain) {
        super(chain, cmds_1.GET_BLOCK_COUNT);
    }
    getParams() {
        const params = [];
        return params;
    }
    static fromJson(object) {
        return new GetBlockCountRequest(object.chain);
    }
    toJson() {
        return {
            chain: this.chain,
        };
    }
}
exports.GetBlockCountRequest = GetBlockCountRequest;

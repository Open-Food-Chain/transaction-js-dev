"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBlockRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetBlockRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, hashOrHeight, verbosity) {
        super(chain, cmds_1.GET_BLOCK);
        this.hashOrHeight = hashOrHeight;
        this.verbosity = verbosity;
    }
    getParams() {
        const params = [
            this.hashOrHeight,
            this.verbosity,
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new GetBlockRequest(object.chain, object.hashOrHeight, object.verbosity != null ? object.verbosity : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            hashOrHeight: this.hashOrHeight,
            verbosity: this.verbosity
        };
    }
}
exports.GetBlockRequest = GetBlockRequest;

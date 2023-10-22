"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateConversionRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class EstimateConversionRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, output) {
        super(chain, cmds_1.ESTIMATE_CONVERSION);
        this.output = output;
    }
    getParams() {
        const params = [
            this.output
        ];
        return params;
    }
    static fromJson(object) {
        return new EstimateConversionRequest(object.chain, object.output);
    }
    toJson() {
        return {
            chain: this.chain,
            output: this.output
        };
    }
}
exports.EstimateConversionRequest = EstimateConversionRequest;

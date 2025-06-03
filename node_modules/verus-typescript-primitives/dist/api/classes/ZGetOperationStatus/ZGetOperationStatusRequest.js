"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZGetOperationStatusRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class ZGetOperationStatusRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, operations) {
        super(chain, cmds_1.Z_GET_OPERATION_STATUS);
        this.operations = operations;
    }
    getParams() {
        const params = [
            this.operations
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new ZGetOperationStatusRequest(object.chain, object.operations);
    }
    toJson() {
        return {
            chain: this.chain,
            operations: this.operations,
        };
    }
}
exports.ZGetOperationStatusRequest = ZGetOperationStatusRequest;

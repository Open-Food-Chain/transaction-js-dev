"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVdxfIdRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetVdxfIdRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, vdxfuri, initialdata) {
        super(chain, cmds_1.GET_VDXF_ID);
        this.vdxfuri = vdxfuri;
        this.initialdata = initialdata;
    }
    getParams() {
        const params = [
            this.vdxfuri,
            this.initialdata,
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new GetVdxfIdRequest(object.chain, object.vdxfuri, object.initialdata != null ? object.initialdata : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            vdxfuri: this.vdxfuri,
            initialdata: this.initialdata
        };
    }
}
exports.GetVdxfIdRequest = GetVdxfIdRequest;

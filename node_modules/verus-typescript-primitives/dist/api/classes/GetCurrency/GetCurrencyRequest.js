"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrencyRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetCurrencyRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, currencyname) {
        super(chain, cmds_1.GET_CURRENCY);
        this.currencyname = currencyname;
    }
    getParams() {
        const params = [
            this.currencyname
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new GetCurrencyRequest(object.chain, object.currencyname);
    }
    toJson() {
        return {
            chain: this.chain,
            currencyname: this.currencyname
        };
    }
}
exports.GetCurrencyRequest = GetCurrencyRequest;

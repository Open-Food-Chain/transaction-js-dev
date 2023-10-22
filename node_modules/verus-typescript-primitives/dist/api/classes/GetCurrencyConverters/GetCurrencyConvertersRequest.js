"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrencyConvertersRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetCurrencyConvertersRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, currencies) {
        super(chain, cmds_1.GET_CURRENCY_CONVERTERS);
        this.currencies = currencies;
    }
    getParams() {
        return this.currencies;
    }
    static fromJson(object) {
        return new GetCurrencyConvertersRequest(object.chain, object.currencies);
    }
    toJson() {
        return {
            chain: this.chain,
            currencies: this.currencies
        };
    }
}
exports.GetCurrencyConvertersRequest = GetCurrencyConvertersRequest;

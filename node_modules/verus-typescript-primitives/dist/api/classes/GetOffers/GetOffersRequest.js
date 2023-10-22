"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOffersRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class GetOffersRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, currencyorid, iscurrency, withtx) {
        super(chain, cmds_1.GET_OFFERS);
        this.currencyorid = currencyorid;
        this.iscurrency = iscurrency;
        this.withtx = withtx;
    }
    getParams() {
        const params = [
            this.currencyorid,
            this.iscurrency == null ? false : this.iscurrency,
            this.withtx,
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new GetOffersRequest(object.chain, object.currencyorid, object.iscurrency != null ? object.iscurrency : undefined, object.withtx != null ? object.withtx : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            currencyorid: this.currencyorid,
            iscurrency: this.iscurrency,
            withtx: this.withtx
        };
    }
}
exports.GetOffersRequest = GetOffersRequest;

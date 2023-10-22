"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeOfferRequest = void 0;
const ApiRequest_1 = require("../../ApiRequest");
const cmds_1 = require("../../../constants/cmds");
class MakeOfferRequest extends ApiRequest_1.ApiRequest {
    constructor(chain, fromaddress, offer, returntx, feeamount) {
        super(chain, cmds_1.MAKE_OFFER);
        this.fromaddress = fromaddress;
        this.offer = offer;
        this.returntx = returntx;
        this.feeamount = feeamount;
    }
    getParams() {
        const params = [
            this.fromaddress,
            this.offer,
            this.returntx == null ? false : this.returntx,
            this.feeamount,
        ];
        return params.filter((x) => x != null);
    }
    static fromJson(object) {
        return new MakeOfferRequest(object.chain, object.fromaddress, object.offer, object.returntx != null ? object.returntx : undefined, object.feeamount != null ? object.feeamount : undefined);
    }
    toJson() {
        return {
            chain: this.chain,
            fromaddress: this.fromaddress,
            offer: this.offer,
            returntx: this.returntx,
            feeamount: this.feeamount,
        };
    }
}
exports.MakeOfferRequest = MakeOfferRequest;

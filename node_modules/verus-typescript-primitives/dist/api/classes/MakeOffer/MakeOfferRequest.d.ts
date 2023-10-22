import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
import { OfferForMaking } from "../../../offers/OfferForMaking";
export declare class MakeOfferRequest extends ApiRequest {
    fromaddress: string;
    offer: OfferForMaking;
    returntx?: boolean;
    feeamount?: number;
    constructor(chain: string, fromaddress: string, offer: OfferForMaking, returntx?: boolean, feeamount?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): MakeOfferRequest;
    toJson(): ApiPrimitiveJson;
}

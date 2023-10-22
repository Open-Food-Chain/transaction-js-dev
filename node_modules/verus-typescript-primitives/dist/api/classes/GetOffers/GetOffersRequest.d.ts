import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetOffersRequest extends ApiRequest {
    currencyorid: string;
    iscurrency?: boolean;
    withtx?: boolean;
    constructor(chain: string, currencyorid: string, iscurrency?: boolean, withtx?: boolean);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetOffersRequest;
    toJson(): ApiPrimitiveJson;
}

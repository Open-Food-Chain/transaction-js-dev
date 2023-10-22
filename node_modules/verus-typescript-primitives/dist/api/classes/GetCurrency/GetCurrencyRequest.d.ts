import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetCurrencyRequest extends ApiRequest {
    currencyname?: string;
    constructor(chain: string, currencyname?: string);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetCurrencyRequest;
    toJson(): ApiPrimitiveJson;
}

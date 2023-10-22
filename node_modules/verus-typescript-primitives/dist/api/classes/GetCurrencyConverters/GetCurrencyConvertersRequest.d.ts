import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetCurrencyConvertersRequest extends ApiRequest {
    currencies: Array<string>;
    constructor(chain: string, currencies: Array<string>);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetCurrencyConvertersRequest;
    toJson(): ApiPrimitiveJson;
}

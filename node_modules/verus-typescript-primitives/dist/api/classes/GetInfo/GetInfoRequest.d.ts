import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetInfoRequest extends ApiRequest {
    constructor(chain: string);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetInfoRequest;
    toJson(): ApiPrimitiveJson;
}

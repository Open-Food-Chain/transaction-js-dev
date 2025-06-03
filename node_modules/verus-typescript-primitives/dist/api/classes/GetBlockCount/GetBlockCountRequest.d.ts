import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetBlockCountRequest extends ApiRequest {
    constructor(chain: string);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetBlockCountRequest;
    toJson(): ApiPrimitiveJson;
}

import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetBlockRequest extends ApiRequest {
    hashOrHeight: string;
    verbosity?: number;
    constructor(chain: string, hashOrHeight: string, verbosity?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetBlockRequest;
    toJson(): ApiPrimitiveJson;
}

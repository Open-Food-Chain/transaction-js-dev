import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class ZGetOperationStatusRequest extends ApiRequest {
    operations?: Array<string>;
    constructor(chain: string, operations?: Array<string>);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): ZGetOperationStatusRequest;
    toJson(): ApiPrimitiveJson;
}

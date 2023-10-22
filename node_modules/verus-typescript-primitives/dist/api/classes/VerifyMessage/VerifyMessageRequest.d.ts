import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
export declare class VerifyMessageRequest extends ApiRequest {
    tAddrOrIdentity: string;
    signature: string;
    message: string;
    checklatest?: boolean;
    constructor(chain: string, tAddrOrIdentity: string, signature: string, message: string, checklatest?: boolean);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): VerifyMessageRequest;
    toJson(): ApiPrimitiveJson;
}

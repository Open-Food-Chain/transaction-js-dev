import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
export declare class SignMessageRequest extends ApiRequest {
    tAddrOrIdentity: string;
    message: string;
    cursig?: string;
    constructor(chain: string, tAddrOrIdentity: string, message: string, cursig?: string);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): SignMessageRequest;
    toJson(): ApiPrimitiveJson;
}

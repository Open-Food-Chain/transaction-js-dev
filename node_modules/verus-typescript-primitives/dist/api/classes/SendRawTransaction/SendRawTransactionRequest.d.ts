import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class SendRawTransactionRequest extends ApiRequest {
    hexstring: string;
    allowhighfees?: boolean;
    constructor(chain: string, hexstring: string, allowhighfees?: boolean);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): SendRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}

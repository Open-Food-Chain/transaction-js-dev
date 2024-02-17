import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetRawTransactionRequest extends ApiRequest {
    txid: string;
    verbose?: number;
    constructor(chain: string, txid: string, verbose?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}

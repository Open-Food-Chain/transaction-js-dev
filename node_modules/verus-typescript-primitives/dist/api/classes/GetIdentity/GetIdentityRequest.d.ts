import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
export declare class GetIdentityRequest extends ApiRequest {
    nameOrAddress: string;
    height?: number;
    txproof?: boolean;
    txproofheight?: number;
    constructor(chain: string, nameOrAddress: string, height?: number, txproof?: boolean, txproofheight?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetIdentityRequest;
    toJson(): ApiPrimitiveJson;
}

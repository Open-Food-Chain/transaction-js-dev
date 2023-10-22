import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
interface Addresses {
    addresses: Array<string>;
    chaininfo?: boolean;
    friendlynames?: boolean;
}
export declare class GetAddressUtxosRequest extends ApiRequest {
    addresses: Addresses;
    constructor(chain: string, addresses: Addresses);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetAddressUtxosRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

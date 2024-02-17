import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
interface Addresses {
    addresses: Array<string>;
    start?: number;
    end?: number;
    chaininfo?: boolean;
    verbosity?: number;
    friendlynames?: boolean;
}
export declare class GetAddressMempoolRequest extends ApiRequest {
    addresses: Addresses;
    constructor(chain: string, addresses: Addresses);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetAddressMempoolRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

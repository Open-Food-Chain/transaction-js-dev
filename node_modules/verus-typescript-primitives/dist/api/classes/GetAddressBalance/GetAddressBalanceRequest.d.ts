import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
export declare class GetAddressBalanceRequest extends ApiRequest {
    addresses: {
        addresses: Array<string>;
        friendlynames?: boolean;
    };
    constructor(chain: string, addresses: {
        addresses: Array<string>;
        friendlynames?: boolean;
    });
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetAddressBalanceRequest;
    toJson(): ApiPrimitiveJson;
}

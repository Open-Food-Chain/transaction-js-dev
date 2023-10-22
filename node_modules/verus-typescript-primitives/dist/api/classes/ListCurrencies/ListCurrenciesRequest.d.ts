import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
declare type QueryObject = {
    launchstate?: "prelaunch" | "launched" | "refund" | "complete";
    systemtype?: "local" | "imported" | "gateway" | "pbaas";
    fromsystem?: string;
    converter?: Array<string>;
};
export declare class ListCurrenciesRequest extends ApiRequest {
    query?: QueryObject;
    startblock?: number;
    endblock?: number;
    constructor(chain: string, query?: QueryObject, startblock?: number, endblock?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): ListCurrenciesRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

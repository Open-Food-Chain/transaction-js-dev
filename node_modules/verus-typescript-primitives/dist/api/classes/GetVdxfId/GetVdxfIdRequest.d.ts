import { ApiRequest } from "../../ApiRequest";
import { RequestParams, ApiPrimitiveJson } from "../../ApiPrimitive";
declare type InitialVdxfData = {
    vdxfkey: string;
    uint256: string;
    indexnum: string;
};
export declare class GetVdxfIdRequest extends ApiRequest {
    vdxfuri: string;
    initialdata?: InitialVdxfData;
    constructor(chain: string, vdxfuri: string, initialdata?: InitialVdxfData);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): GetVdxfIdRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

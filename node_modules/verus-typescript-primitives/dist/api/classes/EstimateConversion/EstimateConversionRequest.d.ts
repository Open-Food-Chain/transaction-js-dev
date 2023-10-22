import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
declare type Output = {
    currency: string;
    amount: number;
    convertto: string;
    preconvert?: boolean;
    via?: string;
};
export declare class EstimateConversionRequest extends ApiRequest {
    output: Output;
    constructor(chain: string, output: Output);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): EstimateConversionRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
declare type output = {
    currency: string;
    amount: number;
    convertto?: string;
    exportto?: string;
    exportid?: boolean;
    exportcurrency?: boolean;
    feecurrency?: string;
    via?: string;
    address: string;
    refundto?: string;
    memo?: string;
    preconvert?: boolean;
    burn?: boolean;
    mintnew?: boolean;
};
export declare class SendCurrencyRequest extends ApiRequest {
    fromaddress: string;
    outputs: Array<output>;
    minconf?: number;
    feeamount?: number;
    returntxtemplate?: boolean;
    constructor(chain: string, fromaddress: string, outputs: Array<output>, minconf?: number, feeamount?: number, returntxtemplate?: boolean);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): SendCurrencyRequest;
    toJson(): ApiPrimitiveJson;
}
export {};

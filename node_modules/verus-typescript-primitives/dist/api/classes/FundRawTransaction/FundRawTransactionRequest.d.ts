import { ApiRequest } from "../../ApiRequest";
import { ApiPrimitiveJson, RequestParams } from "../../ApiPrimitive";
declare type Utxo = {
    voutnum: number;
    txid: string;
};
export declare class FundRawTransactionRequest extends ApiRequest {
    txhex: string;
    utxos?: Array<Utxo>;
    changeaddr?: string;
    explicitfee?: number;
    constructor(chain: string, txhex: string, utxos?: Array<Utxo>, changeaddr?: string, explicitfee?: number);
    getParams(): RequestParams;
    static fromJson(object: ApiPrimitiveJson): FundRawTransactionRequest;
    toJson(): ApiPrimitiveJson;
}
export {};
